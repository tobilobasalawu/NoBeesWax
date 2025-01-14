from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from model import CouponGenerator

app = Flask(__name__)
CORS(app)

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    try:
        retailer = request.json.get('retailer')
        if not retailer:
            return jsonify({'error': 'Retailer name is required'}), 400

        # Generate coupon
        coupon_data = await CouponGenerator.generate_coupon(retailer)
        
        # Prepare response
        response_data = {
            'timestamp': datetime.now().isoformat(),
            'retailer': retailer,
            'code': coupon_data['code'],
            'description': coupon_data['description'],
            'details': coupon_data['details']
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
