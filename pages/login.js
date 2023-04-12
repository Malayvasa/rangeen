import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import LogIn from '@/components/LogIn';

const Profile = () => {
  const { push } = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  //useEffect to check if user is logged in and redirect to profile page
  useEffect(() => {
    if (session) {
      push('/');
    }
  }, [session]);

  return (
    <div className="min-h-screen flex justify-items-center">
      {!session ? <LogIn /> : <div>You already logged in</div>}
    </div>
  );
};

export default Profile;
