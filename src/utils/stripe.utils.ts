import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_KEY as string;
const stripe = new Stripe(stripeKey);
export default stripe;
