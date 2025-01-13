import asyncio
import ollama
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate('backend/firebasesdk.json') 
firebase_admin.initialize_app(cred)
db = firestore.client()  # Initialize Firestore

async def generate_coupon(retailer):
    client = ollama.AsyncClient()
    response = await client.generate('visharxd/coupon-generator', f'Generate me a coupon code for {retailer}')
    return response['response']

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    retailer = request.json.get('retailer')
    if not retailer:
        return jsonify({'error': 'Retailer is required'}), 400
    
    try:
        coupon = await generate_coupon(retailer)
        
        # Save coupon to Firestore
        db.collection('coupons').add({'retailer': retailer, 'code': coupon})  # Save coupon to Firestore

        return jsonify({'code': coupon})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
