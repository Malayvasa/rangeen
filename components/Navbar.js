import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="mx-auto absolute top-0 py-4 px-4 w-full flex justify-between items-center z-20">
      <div className="flex gap-x-8 items-center font-bold text-neutral-700">
        <div className="font-bold text-2xl">रंगीन</div>
        <Link className="tracking-tight" href="/">
          randomizer
        </Link>
        {session ? (
          <>
            <Link className="tracking-tight" href="/library">
              library
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>

      {session ? (
        <div className="flex gap-4">
          <div className=" text-gray-800/40 ">{session.user.email}</div>
          <button
            className="button text-gray-600"
            onClick={() => supabase.auth.signOut()}
          >
            <svg
              width="24px"
              height="24px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M12 12h7m0 0l-3 3m3-3l-3-3M19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-1"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <Link
            className="px-8 py-2 rounded-md bg-black/70 text-white mix-blend-screen font-bold tracking-tight"
            href="/login"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}
