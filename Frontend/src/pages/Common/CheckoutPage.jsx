import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";

// Initialize Stripe
const stripePromise = loadStripe("your_stripe_publishable_key");

function CheckoutPage() {
  const orderId = "order_123"; // Get this from your booking flow
  const eventName = "Summer Festival 2025";

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    // Redirect to confirmation page or show success message
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    // Show error message to user
  };

  return (
    <div className="checkout-page">
      <h1>Complete Your Purchase</h1>
      <Elements stripe={stripePromise}>
        <PaymentForm
          orderId={orderId}
          eventName={eventName}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Elements>
    </div>
  );
}

export default CheckoutPage;
