# NoBeesWax

NoBeesWax is a revolutionary, privacy-focused platform designed to help users discover, share, and validate discount coupons without compromising on their personal data. Unlike other services, NoBeesWax ensures a seamless, transparent, and secure experience for its users by leveraging advanced AI models and an engaged community.

---

## Table of Contents

1. [Features](#features)
2. [Authentication](#authentication)
3. [Dashboard](#dashboard)
4. [Coupons of the Day](#coupons-of-the-day)
5. [Coupon Hunt](#coupon-hunt)
6. [Community](#community)
7. [Leaderboard](#leaderboard)
8. [Installation](#installation)
9. [Usage](#usage)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- **Privacy-Centric**: No tracking of user behavior.
- **AI-Driven Insights**: Extract and generate coupon codes using state-of-the-art AI models.
- **Engaged Community**: Post, share, and validate coupons collaboratively.
- **Leaderboard**: Gamified experience with rankings and rewards.

---

## Authentication

Authentication in NoBeesWax is handled seamlessly using [Clerk](https://clerk.dev/), allowing users to log in with their GitHub or YouTube accounts. This integration ensures both security and ease of access, making it convenient for users to start discovering deals immediately.

---

## Dashboard

The dashboard provides an intuitive interface with detailed insights about user activity and progress:

- **Total Points**: Your cumulative score from coupon-related activities.
- **Coupons Found**: A tally of successfully identified coupons.
- **Success Rate**: The percentage of validated coupon codes.
- **Current Rank**: Your standing in the weekly leaderboard.
- **Recent Activity**: A chronological view of your couponing journey.

---

## Coupons of the Day

This feature uses Reddit's API to fetch six trending coupon-related image links from the subreddit [r/coupons](https://www.reddit.com/r/coupons). These images are then processed by Nebius AI's API, which integrates the vision model Qwen2-VL-72B to extract the coupon codes and relevant details with high accuracy.

---

## Coupon Hunt

The Coupon Hunt feature empowers the AI model through a fine-tuned dataset and advanced machine learning techniques:

- **Dataset**: Created specifically for fine-tuning, this dataset is available on Hugging Face: [Discount Coupons Dataset](https://huggingface.co/datasets/visharxd/discount-coupons).
- **Fine-Tuning**: Meta’s LLaMA 3.1 8B Instruct was fine-tuned using [Unsloth](https://github.com/unslothai/unsloth).
- **AI Model**: The new model is accessible at:
  - [Hugging Face](https://huggingface.co/visharxd/coupon-generator-2)
  - [Ollama](https://ollama.com/visharxd/coupon-generator)

---

## Community

NoBeesWax’s community feature allows users to:

- Post their own coupons and details.
- Share insights on working and expired codes.
- Interact with others to maximize savings.

All data is stored in Firebase, and plans include using Firebase as a vector database to enable Retrieval-Augmented Generation (RAG), enhancing the AI’s effectiveness with user-generated coupons.

---

## Leaderboard

A weekly leaderboard gamifies the platform, rewarding users for their contributions:

| Rank | Username      | Points  | Coupons Found |
|------|---------------|---------|---------------|
| 🏆  | CouponMaster | 5,230 pts | 45            |
| 🥉  | SaverPro     | 4,150 pts | 38            |
| 🥇  | DiscountHunter | 3,890 pts | 35            |
| #4   | DealFinder   | 3,450 pts | 30            |
| #5   | BargainPro   | 3,120 pts | 28            |

**Scoring System**:

- **Find Coupons**: +50 points for each valid coupon found.
- **Validate Codes**: +30 points for confirming code validity.
- **Share Success**: +20 points for sharing working codes.

---

## Installation

Follow these steps to set up NoBeesWax locally:

1. Clone the Repository:

   ```bash
   git clone https://github.com/Warfarian/NoBeesWax.git
   cd NoBeesWax
   ```

2. Backend Setup:

   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Start the backend server:
     ```bash
     python server.py
     ```
   - Backend server runs at `http://localhost:5000`.

3. Frontend Setup:

   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend application:
     ```bash
     npm start frontend
     ```
4. Ollama (AI Model Seetup):
   - Run the following command:
     ```
     ollama pull visharxd/coupon-generator
     ```     

5. Access the application at `http://localhost:5173`.

---

## Usage

- **Discover Deals**: Browse trending coupons and exclusive offers.
- **Post and Share**: Contribute to the community by sharing your own coupon discoveries.
- **AI-Powered Insights**: Use advanced models to uncover and validate new deals.

---

## Contributing

We welcome contributions from developers, designers, and enthusiasts! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your forked repository:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

For more information, visit the [NoBeesWax GitHub Repository](https://github.com/Warfarian/NoBeesWax).

