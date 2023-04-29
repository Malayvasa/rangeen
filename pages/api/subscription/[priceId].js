import { supabaseAdmin } from '@/utils/supabase';
import initStripe from 'stripe';

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const refreshToken = req.cookies['my-refresh-token'];
  const accessToken = req.cookies['my-access-token'];
  const supabase = supabaseAdmin();
  let user = null;

  if (refreshToken && accessToken) {
    const data = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    user = data.data.user;

    const {
      data: { stripe_customer },
    } = await supabase
      .from('profiles')
      .select('stripe_customer')
      .eq('id', user.id)
      .single();

    const { priceId } = req.query;

    console.log(priceId);
    console.log(stripe_customer);

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    let mode = null;
    if (priceId == 'price_1N1gx5SIhw3xzm9SQUV7fXte') {
      mode = 'payment';
    } else {
      mode = 'subscription';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer: stripe_customer,
    });

    res.send({
      id: session.id,
    });
  } else {
    // make sure you handle this case!
    throw new Error('User is not authenticated.');
  }
};

export default handler;
