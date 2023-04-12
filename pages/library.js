import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import SavedPalettes from '@/components/SavedPalettes';
import { motion } from 'framer-motion';
import LogIn from '@/components/LogIn';

const Library = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { push } = useRouter();

  useEffect(() => {
    if (!session) {
      push('/login');
    }
  }, [session]);

  return (
    <div className="w-screen h-screen flex justify-center py-16">
      {!session ? (
        <LogIn />
      ) : (
        <div className="h-full px-4 overflow-scroll">
          <SavedPalettes session={session} />
        </div>
      )}
    </div>
  );
};

export default Library;
