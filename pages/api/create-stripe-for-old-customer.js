import initStripe from 'stripe';
import { supabaseAdmin } from '../../utils/supabase';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const supabase = supabaseAdmin();

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  const data = await supabase
    .from('profiles')
    .update({ stripe_customer: customer.id })
    .eq('id', req.body.record.id);

  console.log(data);

  res.send(`Customer ${customer.id} created`);
};

export default handler;
