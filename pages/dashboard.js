import { supabase } from '../utils/supabase';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, userFull, loading } = useContext(Supabase_data);
  const router = useRouter();

  const getPortal = async () => {
    const { data } = await axios.post('/api/portal', {
      customerId: userFull.stripe_customer_id,
    });
    router.push(data.url);
  };

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center px-4 py-4 md:py-12 md:px-12">
      <div className="bg-white rounded-3xl shadow-sm w-full h-full flex flex-col p-32 px-8 items-center">
        <h1 className="font-semibold text-3xl">User Dashboard</h1>
        <p className="mb-8">{userFull?.email}</p>
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
