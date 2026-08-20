import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

// During build STRIPE_SECRET_KEY may be empty — use a dummy key so the module can be
// evaluated without throwing "Neither apiKey nor config.authenticator provided".
// At runtime the real key (if set) will be used; if not set, API calls will fail
// gracefully with an authentication error which the route handlers already handle.
const stripe = new Stripe(stripeKey && stripeKey.length > 10 ? stripeKey : 'sk_test_dummy_build_key_123456789', {
  apiVersion: '2026-07-29.dahlia',
});

export default stripe;
export const getStripeServer = () => stripe;
