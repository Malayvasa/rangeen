import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HeaderLogo from './Header_Logo';
import MobileNav from './MobileNav';

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [currentPage, setCurrentPage] = useState('/');
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  return (
    <div className="fixed z-30 top-0 w-screen flex h-max px-4 pt-10">
      <div className="w-full md:w-3/4 items-center font-semibold justify-between rounded-full shadow-lg mx-auto top-0 h-12 px-4 pr-2 md:pr-4  bg-white flex z-20">
        <div className="font-bold text-lg h-full">
          <Link href={'/'}>
            <HeaderLogo />
          </Link>
        </div>
        <div className=" hidden md:flex h-full justify-center items-center text-neutral-600">
          <div className="h-full">
            {' '}
            <Link
              //if url is home page add a bottom border
              className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full`}
              href="/randomizer"
            >
              Randomizer
            </Link>
            <div
              //make bg blue if url is home page and transparent if not

              className={`w-full h-[4px]  -mt-[2px] ${currentPage === '/randomizer'
                ? 'bg-gray-500/20'
                : 'bg-transparent'
                }`}
            ></div>
          </div>

          <div className="h-full">
            <Link
              className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full `}
              href="/colorgpt"
            >
              ColorGPT
            </Link>
            <div
              //make bg blue if url is home page and transparent if not

              className={`w-full h-[4px]  -mt-[2px] ${currentPage === '/colorgpt'
                ? 'bg-gray-500/20'
                : 'bg-transparent'
                }`}
            ></div>
          </div>
          <div className="h-full">
            <Link
              className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full `}
              href="/album_art"
            >
              Album Art
            </Link>
            <div
              //make bg blue if url is home page and transparent if not

              className={`w-full h-[4px]  -mt-[2px] ${currentPage === '/album_art'
                ? 'bg-gray-500/20'
                : 'bg-transparent'
                }`}
            ></div>
          </div>
        </div>

        {session ? (
          <div className="flex h-full gap-4">
            <div className="h-full hidden md:block">
              <Link
                className={`tracking-tight flex items-center px-2 hover:bg-gray-950/5 h-full`}
                href="/library"
              >
                Library
              </Link>
              <div
                //make bg blue if url is home page and transparent if not

                className={`h-[4px] mx-auto -mt-[2px] ${currentPage === '/library'
                  ? 'bg-gray-500/20'
                  : 'bg-transparent'
                  }`}
              ></div>
            </div>
            <div className={`tracking-tight flex items-center md:hidden h-full`}>
              <MobileNav />
            </div>
          </div>
        ) : (
          <div>
            <Link
              className="px-6 text-sm py-[11px] rounded-full bg-black/70 text-white tracking-tight"
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
