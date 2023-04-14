import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [currentPage, setCurrentPage] = useState('/');
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  return (
    <div className="fixed z-20 top-0 w-screen flex h-max p-4">
      <div className="w-full md:w-1/2 items-center justify-between rounded-full shadow-sm mx-auto top-0 h-12 pl-4 pr-2 bg-white flex z-20">
        <div className="flex h-full justify-center items-center text-neutral-700">
          <div className="font-bold text-lg pr-4">रंगीन</div>
          <div className="h-full">
            {' '}
            <Link
              //if url is home page add a bottom border
              className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full`}
              href="/"
            >
              Randomizer
            </Link>
            <div
              //make bg blue if url is home page and transparent if not

              className={`w-full h-[4px]  -mt-[2px] ${
                currentPage === '/' ? 'bg-gray-500/20' : 'bg-transparent'
              }`}
            ></div>
          </div>

          {session ? (
            <>
              <div className="h-full">
                <Link
                  className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full `}
                  href="/colorgpt"
                >
                  ColorGPT
                </Link>
                <div
                  //make bg blue if url is home page and transparent if not

                  className={`w-full h-[4px]  -mt-[2px] ${
                    currentPage === '/colorgpt'
                      ? 'bg-gray-500/20'
                      : 'bg-transparent'
                  }`}
                ></div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        {session ? (
          <div className="flex h-full gap-4">
            <div className="h-full">
              <Link
                className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full`}
                href="/library"
              >
                Library
              </Link>
              <div
                //make bg blue if url is home page and transparent if not

                className={`w-full h-[4px]  -mt-[2px] ${
                  currentPage === '/library'
                    ? 'bg-gray-500/20'
                    : 'bg-transparent'
                }`}
              ></div>
            </div>
            <button
              className="button text-gray-600 pr-2"
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
              className="px-6 text-sm py-2 rounded-full bg-black/70 text-white tracking-tight"
              href="/login"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
