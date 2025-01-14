import asyncio
import re
import ollama

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
        prompt = f"""As an AI coupon generator, create a realistic and specific coupon for {retailer}.
        Include a compelling discount (percentage off, dollar amount, BOGO, etc.) and relevant terms.
        
        Respond with exactly this structure:
        {{
            'code': '<unique_alphanumeric_code>',
            'description': '<specific discount offer, e.g. "25% off your entire purchase" or "Buy one get one 50% off">',
            'details': {{
                'validity': '<where and how the coupon can be used, e.g. "Valid at all US locations and online">',
                'restrictions': '<specific restrictions, e.g. "Minimum purchase of $50 required" or "Limit one per customer">',
                'exclusions': '<specific excluded items/categories, e.g. "Not valid on clearance items or gift cards">',
                'duration': '<specific timeframe, e.g. "Valid through January 31, 2024" or "Expires in 7 days">'
            }}
        }}"""

        try:
            client = ollama.AsyncClient()
            response = await client.generate('visharxd/coupon-generator', prompt)
            parsed_response = CouponGenerator.parse_response(response['response'])
            return parsed_response
        except Exception as e:
            raise RuntimeError(f"Coupon generation failed: {str(e)}")
