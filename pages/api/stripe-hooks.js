import initStripe from 'stripe';
import { buffer } from 'micro';
import { supabaseAdmin } from '../../utils/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event);
  const supabase = supabaseAdmin();

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profiles')
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      await supabase
        .from('profiles')
        .update({
          is_subscribed: false,
          interval: null,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
  }

  res.send({
    received: true,
  });
};

export default handler;
