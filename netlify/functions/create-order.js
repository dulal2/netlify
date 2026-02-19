const Razorpay = require('razorpay');

exports.handler = async (event, context) => {
    // 1. Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 2. Parse body and handle potential empty input
        const data = event.body ? JSON.parse(event.body) : {};
        const amount = data.amount;

        if (!amount) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Amount is required" })
            };
        }

        // 3. Initialize Razorpay (Ensure these exist in Netlify Env Variables)
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        // 4. Create Order
        const order = await instance.orders.create(options);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
