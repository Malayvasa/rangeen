import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import SavedPalettes from '@/components/SavedPalettes';
import LogIn from '@/components/LogIn';

const Library = () => {
  const session = useSession();
  const { push } = useRouter();

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {!session ? (
        <LogIn />
      ) : (
        <div className="h-full w-full md:w-max px-4 py-20 md:p-32">
          <SavedPalettes session={session} />
        </div>
      )}
    </div>
  );
};

export default Library;
