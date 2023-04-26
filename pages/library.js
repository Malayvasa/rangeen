import SavedPalettes from '@/components/SavedPalettes';
import LogIn from '@/components/LogIn';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';

const Library = () => {
  const { session, user, SignOut } = useContext(Supabase_data);

  return (
    <div className="flex justify-center bg-gray-100 w-screen min-h-screen">
      {!session ? (
        <LogIn />
      ) : (
        <div className="h-full w-full md:w-max px-4 py-20 md:p-32">
          <SavedPalettes session={session} />
          <div className="w-full flex justify-center gap-4 text-slate-500 p-8 text-xl pt-16">
            {session.user.email}
            <button
              className="flex justify-center items-center gap-2 bg-slate-200/20 w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
              onClick={() => {
                SignOut();
              }}
            >
              <span className="text-xs">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
