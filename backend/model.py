import asyncio
import re
import json
import ollama
import aiosqlite
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE_NAME = 'coupons.db'

class Database:
    @staticmethod
    async def init_db():
        """Initialize the SQLite database with required tables."""
        async with aiosqlite.connect(DATABASE_NAME) as db:
            await db.execute('''
                CREATE TABLE IF NOT EXISTS coupons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    retailer TEXT NOT NULL,
                    coupon_code TEXT NOT NULL,
                    description TEXT,
                    validity TEXT,
                    restrictions TEXT,
                    exclusions TEXT,
                    duration TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'active'
                )
            ''')
            await db.commit()

    @staticmethod
    async def save_coupon(retailer, coupon_data):
        """Save coupon data to SQLite database."""
        try:
            async with aiosqlite.connect(DATABASE_NAME) as db:
                query = '''
                    INSERT INTO coupons (
                        retailer, coupon_code, description,
                        validity, restrictions, exclusions, duration
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                '''
                values = (
                    retailer,
                    coupon_data['code'],
                    coupon_data['description'],
                    coupon_data['details']['validity'],
                    coupon_data['details']['restrictions'],
                    coupon_data['details']['exclusions'],
                    coupon_data['details']['duration']
                )
                cursor = await db.execute(query, values)
                await db.commit()
                return cursor.lastrowid
        except Exception as e:
            raise RuntimeError(f"Database save failed: {str(e)}")

    @staticmethod
    async def get_coupon(coupon_id):
        """Retrieve a coupon by its ID."""
        async with aiosqlite.connect(DATABASE_NAME) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute(
                'SELECT * FROM coupons WHERE id = ?', 
                (coupon_id,)
            )
            row = await cursor.fetchone()
            if row:
                return dict(row)
            return None

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

# Initialize database on startup
with app.app_context():
    asyncio.run(Database.init_db())

@app.route('/generate-coupon', methods=['POST'])
def generate_coupon_endpoint():
    try:
        retailer = request.json.get('retailer')
        if not retailer:
            return jsonify({'error': 'Retailer name is required'}), 400

        # Generate coupon
        coupon_data = asyncio.run(CouponGenerator.generate_coupon(retailer))
        
        # Save to SQLite
        coupon_id = asyncio.run(Database.save_coupon(retailer, coupon_data))
        
        # Get the saved coupon
        saved_coupon = asyncio.run(Database.get_coupon(coupon_id))
        
        # Prepare response
        response_data = {
            'id': coupon_id,
            'code': saved_coupon['coupon_code'],
            'description': saved_coupon['description'],
            'details': {
                'validity': saved_coupon['validity'],
                'restrictions': saved_coupon['restrictions'],
                'exclusions': saved_coupon['exclusions'],
                'duration': saved_coupon['duration']
            },
            'created_at': saved_coupon['created_at'],
            'status': saved_coupon['status']
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