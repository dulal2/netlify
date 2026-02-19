const Razorpay = require('razorpay');

exports.handler = async (event) => {
    // Only allow POST requests from your app
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { amount } = JSON.parse(event.body);

        // Initialize Razorpay with environment variables
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount, // Amount in paise (e.g., 50000 for ₹500)
            currency: "INR",
            receipt: `receipt_${Math.floor(Math.random() * 1000000)}`,
        };

        const order = await razorpay.orders.create(options);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};