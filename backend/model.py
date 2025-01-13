import asyncio
import re
import json
import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# Load Firebase credentials
cred = credentials.Certificate('backend/firebasesdk.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

class CouponGenerator:
    @staticmethod
    def parse_response(response_text):
        """Parse the LLM response using regex to extract structured data."""
        try:
            # Extract code
            code_match = re.search(r"'code':\s*'([^']*)'", response_text)
            code = code_match.group(1) if code_match else None

            # Extract description
            desc_match = re.search(r"'description':\s*'([^']*)'", response_text)
            description = desc_match.group(1) if desc_match else None

            # Extract details dictionary
            details_pattern = r"'details':\s*{([^}]*)}"
            details_match = re.search(details_pattern, response_text)
            
            if details_match:
                details_text = details_match.group(1)
                # Parse individual details fields
                validity = re.search(r"'validity':\s*'([^']*)'", details_text)
                restrictions = re.search(r"'restrictions':\s*'([^']*)'", details_text)
                exclusions = re.search(r"'exclusions':\s*'([^']*)'", details_text)
                duration = re.search(r"'duration':\s*'([^']*)'", details_text)

                details = {
                    'validity': validity.group(1) if validity else None,
                    'restrictions': restrictions.group(1) if restrictions else None,
                    'exclusions': exclusions.group(1) if exclusions else None,
                    'duration': duration.group(1) if duration else None
                }
            else:
                details = {}

            return {
                'code': code,
                'description': description,
                'details': details
            }
        except Exception as e:
            raise ValueError(f"Failed to parse LLM response: {str(e)}")

    @staticmethod
    async def generate_coupon(retailer):
        """Generate a coupon using the Ollama API."""
        prompt = f"""Generate me a coupon code for {retailer}. 
        Respond with exactly this structure:
        {{
            'code': '<generated_coupon_code>',
            'description': 'Special discount for {retailer} purchases',
            'details': {{
                'validity': 'Valid online and in stores',
                'restrictions': 'Cannot be combined with other offers',
                'exclusions': 'Some exclusions may apply',
                'duration': 'Limited time offer'
            }}
        }}"""

        try:
            client = ollama.AsyncClient()
            response = await client.generate('visharxd/coupon-generator', prompt)
            parsed_response = CouponGenerator.parse_response(response['response'])
            return parsed_response
        except Exception as e:
            raise RuntimeError(f"Coupon generation failed: {str(e)}")

class FirestoreManager:
    def __init__(self, db):
        self.db = db

    async def save_coupon(self, retailer, coupon_data):
        """Save coupon data to Firestore with proper structure."""
        try:
            timestamp = firestore.SERVER_TIMESTAMP
            doc_ref = self.db.collection('coupons').document()
            await doc_ref.set({
                'retailer': retailer,
                'coupon_code': coupon_data['code'],
                'description': coupon_data['description'],
                'details': coupon_data['details'],
                'created_at': timestamp,
                'status': 'active'
            })
            return doc_ref.id
        except Exception as e:
            raise RuntimeError(f"Firestore save failed: {str(e)}")

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    try:
        retailer = request.json.get('retailer')
        if not retailer:
            return jsonify({'error': 'Retailer name is required'}), 400

        # Generate coupon
        coupon_generator = CouponGenerator()
        coupon_data = await coupon_generator.generate_coupon(retailer)
        
        # Save to Firestore
        firestore_manager = FirestoreManager(db)
        doc_id = await firestore_manager.save_coupon(retailer, coupon_data)
        
        # Add document ID to response
        response_data = {
            **coupon_data,
            'id': doc_id,
            'status': 'success'
        }
        
        return jsonify(response_data)

    except ValueError as e:
        return jsonify({'error': 'Validation error', 'message': str(e)}), 400
    except RuntimeError as e:
        return jsonify({'error': 'Processing error', 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Unexpected error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)