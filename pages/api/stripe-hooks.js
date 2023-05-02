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
  const user = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer', event.data.object.customer)
    .single();

  const currentOpenAiGenerations = user.data.openai_generations;
  const currentPeriodEnd = user.data.current_period_end || null;

  if (event.type === 'customer.subscription.updated') {
    // if the subscription is canceled, set the current_period_end to null
    if (event.data.object.cancel_at_period_end) {
      await supabase
        .from('profiles')
        .update({
          current_period_end: null,
        })
        .eq('stripe_customer', event.data.object.customer);
    }

    // if the subscription is active and the current_period_end is not the same as the one in the database, update the current_period_end
    if (
      !event.data.object.cancel_at_period_end &&
      currentPeriodEnd !== event.data.object.current_period_end
    ) {
      await supabase
        .from('profiles')
        .update({
          current_period_end: event.data.object.current_period_end,
          openai_generations: currentOpenAiGenerations + 30,
        })
        .eq('stripe_customer', event.data.object.customer);
    }
  }

  switch (event.type) {
    case 'customer.subscription.created':
      await supabase
        .from('profiles')
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
          openai_generations: currentOpenAiGenerations + 30,
          current_period_end: event.data.object.current_period_end,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      await supabase
        .from('profiles')
        .update({
          is_subscribed: false,
          interval: null,
          current_period_end: null,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
  }

  res.send({
    received: true,
  });
};

export default handler;
