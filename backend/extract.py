import csv
import requests
from openai import OpenAI
from dotenv import load_dotenv
import os
import time
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

# Add retry decorator with exponential backoff
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def process_image_with_api(client, url):  # Removed async since OpenAI client is synchronous
    response = client.chat.completions.create(
        model="Qwen/Qwen2-VL-72B-Instruct",
        messages=[                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this coupon image and provide the following information in a structured format:\n1. Discount Coupon: [extract any coupon code, promo code, or discount code]\n2. Brand: [extract the company or brand name]\n3. Info: [extract discount amount, offer details, and/or expiry date]\n\nPlease format your response exactly like this example:\nDiscount Coupon: SAVE20\nBrand: Amazon\nInfo: 20% off on electronics, expires Dec 31"},
                            {"type": "image_url", "image_url": {"url": url}},
                        ],
                    }
        ],
        max_tokens=200,
    )
    return response

try:
    # Initialize the OpenAI client with correct base URL format
    client = OpenAI(
        base_url="https://api.studio.nebius.ai/v1",  # Removed trailing space
        api_key=os.environ.get("NEBIUS_API_KEY")
    )

    # Define the output CSV file path
    output_csv_path = r'C:\Users\kashy\OneDrive\Desktop\nosu\coupons_output2.csv'

    # Open the CSV file in write mode and create a writer object
    with open(output_csv_path, mode='w', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)
        
        # Write the header row
        csv_writer.writerow(["Discount Coupon", "Brand", "Info"])

        # Open and read the image URLs from the file
        with open(r'C:\Users\kashy\OneDrive\Desktop\nosu\image_urls.txt') as coupons:
            for url in coupons:
                url = url.strip()  # Remove any leading/trailing whitespace

                try:
                    # Verify image URL is accessible before processing
                    img_response = requests.head(url, timeout=10)
                    if img_response.status_code != 200:
                        print(f"Image URL {url} is not accessible (status code: {img_response.status_code})")
                        csv_writer.writerow(["Error", f"Image not accessible - {img_response.status_code}", "N/A"])
                        continue

                    # Process image with retry logic
                    response = process_image_with_api(client, url)

                    # Extract the unstructured response text
                    response_text = response.choices[0].message.content

                    # Use another LLM to process the unstructured response
                    # Parse the structured response directly from the first model
                    response_lines = response_text.splitlines()
                    
                    # Extract the fields from the structured response
                    coupon = "N/A"
                    brand = "N/A"
                    info = "N/A"
                    for line in response_lines:
                        if line.startswith("Discount Coupon:"):
                            coupon = line.split("Discount Coupon:", 1)[1].strip()
                        elif line.startswith("Brand:"):
                            brand = line.split("Brand:", 1)[1].strip()
                        elif line.startswith("Info:"):
                            info = line.split("Info:", 1)[1].strip()

                    # Write the extracted data to the CSV file
                    csv_writer.writerow([coupon, brand, info])

                    # Add delay between requests to avoid rate limiting
                    time.sleep(2)  # Wait 2 seconds between requests

                except Exception as e:
                    print(f"Error processing URL {url}: {e}")
                    time.sleep(5)  # Longer wait on error
                    continue

except Exception as e:
    print(f"Error occurred: {str(e)}")

print(f"Output has been written to {output_csv_path}")
