import praw
import requests
import os
from urllib.parse import urlparse
import time

# Reddit API Setup
reddit = praw.Reddit(client_id='CLIENT_ID',
                     client_secret='CLIENT_SECRET',
                     user_agent='python:CouponScraper:v1.0 (by /u/user)')

# Create a directory to save images
output_dir = 'downloaded_images'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Function to download image with retry logic and rate limit handling
def download_image(url, save_path, retries=3):
    attempt = 0
    while attempt < retries:
        try:
            
            img_data = requests.get(url).content
            
            with open(save_path, 'wb') as f:
                f.write(img_data)
            print(f"Downloaded {save_path}")
            return  
        except Exception as e:
            attempt += 1
            print(f"Failed to download {url}, attempt {attempt}: {e}")
            if attempt < retries:
                time.sleep(3)  
            else:
                print(f"Skipping {url} after {retries} attempts.")
            continue

# Function to scrape and download images from r/coupons
def download_images_from_subreddit(subreddit_name):
    subreddit = reddit.subreddit(subreddit_name)
    
    for post in subreddit.top(limit=200): # top, new or hot
        if post.url.endswith(('.jpg', '.jpeg', '.png')):  
            image_url = post.url 
            file_name = os.path.basename(urlparse(image_url).path)
            save_path = os.path.join(output_dir, file_name)
            download_image(image_url, save_path)
        
        remaining_requests = reddit.auth.limits['remaining']
        if remaining_requests == 0:
            reset_time = reddit.auth.limits['reset_timestamp']
            sleep_time = reset_time - time.time() + 1  # Sleep until the rate limit resets
            print(f"Rate limit hit. Sleeping for {sleep_time:.2f} seconds...")
            time.sleep(sleep_time)

        time.sleep(1)

download_images_from_subreddit('coupons')