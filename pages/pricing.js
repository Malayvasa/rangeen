import initStripe from 'stripe';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const Pricing = ({ plans }) => {
  const { user, userFull, AddPaletteToLibrary } = useContext(Supabase_data);

  const processSubscription = async (priceId) => {
    const data = await axios.get(`/api/subscription/${priceId}`);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId: data.data.id });
  };

  const showSubscribeButton = !!userFull && !userFull.is_subscribed;
  const showSignUpButton = !userFull;
  const ManageSubscription = !!userFull && userFull.is_subscribed;

  return (
    <div className="h-screen w-screen flex flex-col gap-4 justify-center bg-gray-100 items-center px-4 py-4 md:py-12 md:px-12">
      <div className="blur-[80px] md:blur-[120px] fixed z-10 top-1/2 left-1/2 saturate-[200%] ">
        <div className="circle1 left-1/2 top-1/2 z-10 "></div>
        <div className="circle2 left-1/2 top-1/2 z-10 "></div>
        <div className="circle3 left-1/2 top-1/2 z-10 "></div>
      </div>

      {plans.map((plan) =>
        plan.id == 'price_1N2JIsSIhw3xzm9SvWJ4LTuM' ||
        plan.id == 'price_1N2JKUSIhw3xzm9SVSHfmBCE' ||
        plan.id == 'price_1N1gvXSIhw3xzm9STGLzyDXB' ||
        plan.id == 'price_1N2HVRSIhw3xzm9STXakfpds' ? (
          <div key={plan.id} className="z-20">
            <div className="bg-white w-96 z-20 shadow-lg rounded-lg px-4 py-4 flex flex-col">
              <div className="flex flex-col w-full justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {plan.name}
                </h2>
                <p className="mt-1 text-xl text-blue-500 font-semibold">
                  {plan.currency === 'inr' ? '₹' : '$'}
                  {plan.price}/ {plan.interval}
                  {plan.description}
                </p>
              </div>
              <div>
                {(plan.id == 'price_1N2JIsSIhw3xzm9SvWJ4LTuM' ||
                  plan.id == 'price_1N1gvXSIhw3xzm9STGLzyDXB') && (
                  <div className=" gap-2 flex flex-col mt-8 bg-gray-200 p-2 rounded-md">
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">
                        Unlimited
                      </span>{' '}
                      Album Art Palettes
                    </p>
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">30</span>{' '}
                      ColorGPT Palettes/mo
                    </p>
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">
                        Early Access
                      </span>{' '}
                      To New Features
                    </p>
                  </div>
                )}
                {(plan.id == 'price_1N2JKUSIhw3xzm9SVSHfmBCE' ||
                  plan.id == 'price_1N2HVRSIhw3xzm9STXakfpds') && (
                  <div className=" gap-2 flex flex-col mt-8 bg-gray-200 p-2 rounded-md">
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">
                        Support
                      </span>{' '}
                      Development of Rangeen
                    </p>
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">
                        Unlimited
                      </span>{' '}
                      Album Art Palettes
                    </p>
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">30</span>{' '}
                      ColorGPT Palettes/mo
                    </p>
                    <p className="text-gray-500 text-md">
                      <span className="text-gray-900 font-semibold">
                        Early Access
                      </span>{' '}
                      To New Features
                    </p>
                  </div>
                )}
              </div>

              {showSubscribeButton && (
                <button
                  onClick={() => {
                    processSubscription(plan.id);
                  }}
                  className="mt-4 w-full bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  Subscribe
                </button>
              )}

              {showSignUpButton && (
                <Link
                  href={'/signup'}
                  className="mt-4 w-full bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        ) : (
          <></>
        )
      )}
      {ManageSubscription && (
        <Link
          href="/dashboard"
          className="mt-4 shadow-lg z-20 w-max bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Manage Your Subscription
        </Link>
      )}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        interval: price.recurring?.interval ? price.recurring.interval : '',
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;
