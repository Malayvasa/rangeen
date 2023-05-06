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

    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    res.send({
      url: session.url,
    });
  } else {
    // make sure you handle this case!
    throw new Error('User is not authenticated.');
  }
};

export default handler;
