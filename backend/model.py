import asyncio
import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

async def generate_coupon(retailer):
    client = ollama.AsyncClient()
    response = await client.generate('visharxd/coupon-generator', f'Generate me a coupon code for {retailer}')
    return response['response']

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    retailer = request.json.get('retailer')
    if not retailer:
        return jsonify({'error': 'Retailer is required'}), 400
    
    # Validate retailer is one of the allowed options
    allowed_retailers = {'amazon', 'walmart', 'target', 'bestbuy', 'newegg'}
    if retailer.lower() not in allowed_retailers:
        return jsonify({'error': f'Invalid retailer. Must be one of: {", ".join(allowed_retailers)}'}), 400
    
    try:
        print(f"Generating coupon for retailer: {retailer}")  # Debug log
        coupon = await generate_coupon(retailer)
        if not coupon:
            return jsonify({'error': 'Failed to generate coupon'}), 500
        return jsonify({'code': coupon})
    except Exception as e:
        print(f"Error generating coupon: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)