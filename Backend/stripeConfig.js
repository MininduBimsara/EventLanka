// Configuration for Stripe in the frontend
import { loadStripe } from "@stripe/stripe-js";

// Replace with your Stripe publishable key from environment variables
const stripePublishableKey =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here";

// Create a promise that resolves with the Stripe object
export const stripePromise = loadStripe(stripePublishableKey);

// Export configuration options for card elements
export const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#4B5563",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  },
};
