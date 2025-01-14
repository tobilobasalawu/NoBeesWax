import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from model import CouponGenerator
from coupon import CouponAnalyzer

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/generate-coupon', methods=['POST'])
async def generate_coupon_endpoint():
    try:
        retailer = request.json.get('retailer')
        if not retailer:
            logging.error("Retailer name is required")
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
        
        logging.info(f"Coupon generated for retailer: {retailer}")
        return jsonify(response_data)

    except ValueError as e:
        logging.error(f"Validation error: {e}")
        return jsonify({'error': 'Validation error', 'message': str(e)}), 400
    except RuntimeError as e:
        logging.error(f"Processing error: {e}")
        return jsonify({'error': 'Processing error', 'message': str(e)}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Unexpected error', 'message': str(e)}), 500
    
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    subreddit_name = data.get('subreddit', 'coupons')
    image_count = data.get('image_count', 6)

    analyzer = CouponAnalyzer()
    results = analyzer.process_subreddit(subreddit_name, image_count)

    # Parse the results to match the expected format
    parsed_results = []
    for result in results:
        lines = result.split('\n')
        discount_coupon = lines[0].split(': ')[1] if len(lines) > 0 else '-'
        brand = lines[1].split(': ')[1] if len(lines) > 1 else '-'
        info = lines[2].split(': ')[1] if len(lines) > 2 else '-'

        # Format the description without the "Brand:" keyword
        description = f"{brand} - {info}"
        parsed_results.append({
            'coupon': discount_coupon,
            'description': description
        })

    return jsonify(parsed_results)


if __name__ == '__main__':
    app.run(port=5000)