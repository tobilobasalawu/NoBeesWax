import asyncio
import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Load Firebase credentials
cred = credentials.Certificate('backend/firebasesdk.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()


async def generate_coupon(retailer):
    client = ollama.AsyncClient()
    response = await client.generate('visharxd/coupon-generator', f'Generate me a coupon code for {retailer}')
    return response['response']

async def save_coupon_to_firestore(retailer, coupon):
    doc_ref = db.collection('coupons').add({
        'retailer': retailer,
        'coupon_code': coupon
    })

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    retailer = request.json.get('retailer')
    if not retailer:
        return jsonify({'error': 'Retailer is required'}), 400
    
    # Validate retailer is one of the allowed options
    allowed_retailers = {'Amazon', 'Walmart', 'Target', 'BestBuy', 'NewEgg'}
    if retailer.lower() not in allowed_retailers:
        return jsonify({'error': f'Invalid retailer. Must be one of: {", ".join(allowed_retailers)}'}), 400
    
    try:
        print(f"Generating coupon for retailer: {retailer}")  # Debug log
        coupon = await generate_coupon(retailer)
<<<<<<< HEAD
        if not coupon:
            return jsonify({'error': 'Failed to generate coupon'}), 500
=======

        await save_coupon_to_firestore(retailer, coupon)


>>>>>>> d48df09040b51ab64f973d92280d760838c39ef6
        # Add more detailed response
        response_data = {
            'code': coupon,
            'description': f'Special discount for {retailer} purchases',
            'details': {
                'validity': 'Valid online and in stores',
                'restrictions': 'Cannot be combined with other offers',
                'exclusions': 'Some exclusions may apply',
                'duration': 'Limited time offer'
            }
        }
        return jsonify(response_data)
    except Exception as e:
        print(f"Error generating coupon: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
