import os
import json
import pandas as pd
from PIL import Image, UnidentifiedImageError
import base64
from io import BytesIO
import requests
import re
from concurrent.futures import ThreadPoolExecutor, TimeoutError

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    try:
        with Image.open(image_path) as image:
            image.verify()
            image = Image.open(image_path)
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            buffered = BytesIO()
            image.save(buffered, format='JPEG')
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
    except (UnidentifiedImageError, OSError, IOError) as e:
        print(f"Error reading image {image_path}: {str(e)}")
        return None

def extract_potential_codes(text):
    """Extract potential coupon codes from text using various patterns"""
    potential_codes = []
    
    patterns = [
        r"(?:code|coupon|promo)[:\s]+([A-Za-z0-9-_]+)",
        r'(?<![A-Za-z0-9])([A-Za-z0-9][A-Za-z0-9-_]{3,}[A-Za-z0-9])(?![A-Za-z0-9])',
        r'(?<![A-Za-z0-9])([A-Za-z0-9]{6,})(?![A-Za-z0-9])',
        r'(?<![A-Za-z0-9])([A-Za-z]+[0-9]+[A-Za-z0-9]*)(?![A-Za-z0-9])',
        r'(?<![A-Za-z0-9])([0-9]+[A-Za-z]+[A-Za-z0-9]*)(?![A-Za-z0-9])'
    ]
    
    ignore_words = {'limited', 'special', 'offer', 'valid', 'expires', 'download', 'upload', 'discount'}
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            code = match.group(1).strip()
            if (len(code) >= 4 and len(code) <= 20 and 
                code.lower() not in ignore_words and 
                not code.isalpha()):
                potential_codes.append(code)
    
    return potential_codes

def parse_model_response(response_text):
    """Parse the model's response to extract structured information"""
    try:
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass
        
        company_patterns = [
            r"Company Name[:\s]+([^\n]+)",
            r"company[:\s]+([^\n]+)",
            r"from ([^\n]+?) (?:offering|giving|providing)",
            r"([A-Z][A-Za-z0-9\s&]+)(?:is offering|offers|presents)"
        ]
        company = ""
        for pattern in company_patterns:
            match = re.search(pattern, response_text, re.IGNORECASE)
            if match:
                company = match.group(1).strip()
                break
        
        discount_patterns = [
            r"Discount[:\s]+([^\n]+)",
            r"(\d+%[^.\n]*)",
            r"save (\$?\d+(?:\.\d{2})?[^.\n]*)",
            r"(\$?\d+(?:\.\d{2})?(?:\s*-\s*\$?\d+(?:\.\d{2})?)?(?:\s*off)[^.\n]*)",
            r"(free shipping[^.\n]*)",
            r"(buy one get one[^.\n]*)"
        ]
        discount = ""
        for pattern in discount_patterns:
            match = re.search(pattern, response_text, re.IGNORECASE)
            if match:
                discount = match.group(1).strip()
                break
        
        potential_codes = extract_potential_codes(response_text)
        
        code = ""
        if potential_codes:
            potential_codes.sort(key=lambda x: (
                bool(re.search(r'[A-Za-z]', x) and re.search(r'[0-9]', x)),
                len(x),
                bool(re.search(r'[A-Z]', x))
            ), reverse=True)
            code = potential_codes[0]
        
        return {
            'Company Name': company or 'Not found',
            'Discount Offered': discount or 'Not found',
            'Coupon Code': code or 'Not found'
        }
    except Exception as e:
        print(f"Error parsing response: {str(e)}")
        return {
            'Company Name': 'Not found',
            'Discount Offered': 'Not found',
            'Coupon Code': 'Not found'
        }

def extract_coupon_info(image_path):
    """Extract coupon information using Llava model via Ollama"""
    base64_image = encode_image_to_base64(image_path)
    
    if base64_image is None:
        return {
            'Company Name': 'Invalid Image',
            'Discount Offered': 'Invalid Image',
            'Coupon Code': 'Invalid Image'
        }
    
    prompt = """
    Carefully analyze this coupon image and list ALL text you see, especially focusing on:
    1. Company/Brand Name
    2. Discount or Offer Details
    3. ANY alphanumeric strings, codes, or sequences of letters and numbers
    """
    
    try:
        payload = {
            "model": "llava",
            "prompt": prompt,
            "images": [base64_image],
            "stream": False
        }
        
        response = requests.post('http://localhost:11434/api/generate', json=payload, timeout=60)
        response_data = response.json()
        
        if 'response' in response_data:
            coupon_data = parse_model_response(response_data['response'])
            return coupon_data
        else:
            print(f"No 'response' key in response data for {image_path}. Response data: {response_data}")
            return {
                'Company Name': 'Error',
                'Discount Offered': 'Error',
                'Coupon Code': 'Error'
            }
    except requests.exceptions.Timeout:
        print(f"Processing {image_path} timed out!")
        return {
            'Company Name': 'Timeout',
            'Discount Offered': 'Timeout',
            'Coupon Code': 'Timeout'
        }
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return {
            'Company Name': 'Error',
            'Discount Offered': 'Error',
            'Coupon Code': 'Error'
        }

def process_with_timeout(image_path):
    """Wrapper to process an image with a timeout"""
    with ThreadPoolExecutor() as executor:
        future = executor.submit(extract_coupon_info, image_path)
        try:
            return future.result(timeout=60)
        except TimeoutError:
            print(f"Processing {image_path} timed out!")
            return {
                'Company Name': 'Timeout',
                'Discount Offered': 'Timeout',
                'Coupon Code': 'Timeout'
            }

def main():
    image_dir = 'downloaded_images'
    
    if not os.path.exists(image_dir):
        print(f"Error: Directory '{image_dir}' not found!")
        return
    
    all_coupons = []
    valid_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}
    
    for filename in os.listdir(image_dir):
        file_ext = os.path.splitext(filename.lower())[1]
        if file_ext in valid_extensions:
            image_path = os.path.join(image_dir, filename)
            print(f"\nProcessing {filename}...")
            
            coupon_info = process_with_timeout(image_path)
            coupon_info['Image Filename'] = filename
            all_coupons.append(coupon_info)
    
    if all_coupons:
        df = pd.DataFrame(all_coupons)
        output_file = 'coupon_data.xlsx'
        df.to_excel(output_file, index=False)
        print(f"\nData has been saved to {output_file}")
        
        print("\nProcessing Summary:")
        print(f"Total images processed: {len(all_coupons)}")
        print(f"Invalid images: {len([c for c in all_coupons if c['Company Name'] == 'Invalid Image'])}")
        print(f"Processing errors: {len([c for c in all_coupons if c['Company Name'] == 'Error'])}")
        print(f"Timed out images: {len([c for c in all_coupons if c['Company Name'] == 'Timeout'])}")
    else:
        print("No images were processed.")

if __name__ == "__main__":
    main()
