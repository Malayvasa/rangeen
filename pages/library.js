import SavedPalettes from '@/components/SavedPalettes';
import LogIn from '@/components/LogIn';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';

const Library = () => {
  const { session } = useContext(Supabase_data);

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
