import praw
import time
from prawcore.exceptions import PrawcoreException
from dotenv import load_dotenv
import os
from openai import OpenAI  # Nebius uses OpenAI-compatible SDK

class CouponAnalyzer:
    def __init__(self):
        """Initialize the CouponAnalyzer with necessary credentials."""
        load_dotenv()

        self.CLIENT_ID = os.getenv('CLIENT_ID')
        self.CLIENT_SECRET = os.getenv('CLIENT_SECRET')
        self.USER_AGENT = os.getenv('USER_AGENT')
        self.NEBIUS_API_KEY = os.getenv('NEBIUS_API_KEY')

        if not all([self.CLIENT_ID, self.CLIENT_SECRET, self.USER_AGENT]):
            raise ValueError("Missing Reddit API credentials in environment variables")
        if not self.NEBIUS_API_KEY:
            raise ValueError("Missing Nebius API key in environment variables")

        self.reddit = praw.Reddit(
            client_id=self.CLIENT_ID,
            client_secret=self.CLIENT_SECRET,
            user_agent=self.USER_AGENT
        )

        self.client = OpenAI(
            base_url="https://api.studio.nebius.ai/v1/",
            api_key=self.NEBIUS_API_KEY
        )

    def get_hot_image_urls(self, subreddit_name, image_count=6):
        """
        Fetch the top 'hot' image URLs from a subreddit.
        
        Parameters:
            subreddit_name (str): Name of the subreddit to fetch images from.
            image_count (int): Number of image URLs to fetch.

        Returns:
            list: List of image URLs.
        """
        subreddit = self.reddit.subreddit(subreddit_name)
        image_links = []

        print(f"Fetching up to {image_count} images from the hot posts of r/{subreddit_name}...")

        try:
            for post in subreddit.hot(limit=50):
                try:
                    if post.url.endswith(('.jpg', '.png', '.jpeg', '.gif')):
                        image_links.append(post.url)
                        print(f"Found image: {post.url}")

                        if len(image_links) >= image_count:
                            break
                except Exception as e:
                    print(f"Error processing post: {e}")
                    continue

        except PrawcoreException as e:
            print(f"Reddit API error: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []

        print(f"\nFetched {len(image_links)} image URLs.")
        return image_links

    def analyze_images_with_nebius(self, image_links):
        """
        Use Nebius API to analyze images and extract coupon details.

        Parameters:
            image_links (list): List of image URLs to analyze.

        Returns:
            list: Structured information extracted from images.
        """
        if not image_links:
            print("No images to analyze")
            return []

        results = []

        for idx, image_url in enumerate(image_links, start=1):
            print(f"\nAnalyzing image {idx}/{len(image_links)}: {image_url}")
            try:
                response = self.client.chat.completions.create(
                    model="Qwen/Qwen2-VL-72B-Instruct",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Analyze this coupon image and provide the following information in a structured format:\n1. Discount Coupon: [extract any coupon code, promo code, or discount code]\n2. Brand: [extract the company or brand name]\n3. Info: [extract discount amount, offer details, and/or expiry date]\n\nPlease format your response exactly like this example:\nDiscount Coupon: SAVE20\nBrand: Amazon\nInfo: 20% off on electronics, expires Dec 31"
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {"url": image_url}
                                },
                            ],
                        }
                    ],
                    max_tokens=200,
                )
                content = response.choices[0].message.content
                results.append(content)
                time.sleep(1)

            except Exception as e:
                print(f"Error analyzing image: {e}")
                results.append(f"Error analyzing image {idx}: {image_url}")

        return results

    def process_subreddit(self, subreddit_name, image_count=6):
        """Process a subreddit and analyze images."""
        try:
            image_links = self.get_hot_image_urls(subreddit_name, image_count)

            if not image_links:
                print("No images found to analyze.")
                return []

            return self.analyze_images_with_nebius(image_links)

        except Exception as e:
            print(f"Error processing subreddit: {e}")
            return []
