const paymentForm = document.querySelector("#payment-form");
const payButton = document.querySelector("#pay-button");
const status = document.querySelector("#status");

const setStatus = (message, isSuccess = false) => {
    status.textContent = message;
    status.classList.toggle("success", isSuccess);
};

paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    payButton.disabled = true;
    setStatus("Preparing secure payment...");

    try {
        const formData = new FormData(paymentForm);
        const configResponse = await fetch("/api/config");
        const config = await configResponse.json();
        const orderResponse = await fetch("/api/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: "fieldnote-fundamentals", amount: 499 })
        });
        const orderData = await orderResponse.json();
        if (!orderResponse.ok || !orderData.order || !config.keyId) throw new Error(orderData.message || "Unable to create order");

        const checkout = new Razorpay({
            key: config.keyId,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            name: "Fieldnote",
            description: "Fieldnote Fundamentals",
            order_id: orderData.order.id,
            prefill: { name: formData.get("name"), email: formData.get("email") },
            theme: { color: "#e85c35" },
            handler: async (response) => {
                const verification = await fetch("/api/verifyPayment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                });
                const result = await verification.json();
                setStatus(result.message || "Payment complete.", verification.ok);
                payButton.disabled = false;
            },
            modal: { ondismiss: () => { setStatus("Payment cancelled."); payButton.disabled = false; } }
        });
        checkout.open();
    } catch (error) {
        setStatus(error.message || "Something went wrong. Please try again.");
        payButton.disabled = false;
    }
});