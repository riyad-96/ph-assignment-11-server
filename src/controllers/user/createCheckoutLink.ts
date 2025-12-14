import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY as string);
