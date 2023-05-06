import { supabase } from '../utils/supabase';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, userFull, SignOut, loading } = useContext(Supabase_data);
  const router = useRouter();

  const getPortal = async () => {
    const { data } = await axios.post('/api/portal', {
      customerId: userFull.stripe_customer_id,
    });
    router.push(data.url);
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center px-4 py-4 md:py-12 md:px-12">
      <div className="bg-white rounded-3xl shadow-sm w-full h-full flex flex-col p-32 px-8 items-center">
        <h1 className="font-semibold text-3xl">User Dashboard</h1>
        <p className="mb-8 flex justify-center items-center gap-4 mt-4">
          {userFull?.email}
          <button
            className="flex justify-center items-center gap-2 bg-gray-100 w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
            onClick={() => {
              SignOut();
            }}
          >
            <span className="text-xs">Sign Out</span>
          </button>
        </p>
        <div className="bg-gray-100 flex  divide-y-2 flex-col p-4 mb-16 rounded-md w-full md:w-1/2">
          <div className="flex gap-2 w-full justify-between items-center p-8">
            <div>ColorGPT Generations remaining</div>
            <div className="bg-green-200 h-full flex items-center justify-center w-24 text-center text-green-700 rounded-md py-1 px-2">
              {userFull?.openai_generations}
            </div>
          </div>
          <div className="flex gap-2 w-full justify-between items-center p-8">
            <div>Album Art Generations remaining</div>
            <div className="bg-green-200 h-full flex items-center justify-center w-24 text-center text-green-700 rounded-md py-1 px-2">
              {userFull?.is_subscribed
                ? 'Unlimited'
                : userFull?.spotify_generations}
            </div>
          </div>
        </div>

        {!loading &&
          (userFull?.is_subscribed ? (
            <div className="flex flex-col gap-8 items-center">
              <div>
                <button
                  onClick={getPortal}
                  className="p-4 bg-blue-500 text-white rounded-md"
                >
                  Manage Subscription in Stripe Portal
                </button>
              </div>
            </div>
          ) : (
            <>No Active Subscription</>
          ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const refreshToken = req.cookies['my-refresh-token'];
  const accessToken = req.cookies['my-access-token'];
  let user = null;

  if (refreshToken && accessToken) {
    const data = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    user = data.data.user;
  }

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
