import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY in environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2025-02-24.acacia", // Use the latest API version or an appropriate one
  appInfo: {
    name: "Indulge Salon & Spa",
    version: "0.1.0",
  },
});
