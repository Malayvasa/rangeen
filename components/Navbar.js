import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HeaderLogo from './Header_Logo';
import MobileNav from './MobileNav';

export default function NavBar() {
  const { supabase, user, userFull, session, AddPaletteToLibrary } =
    useContext(Supabase_data);
  const [currentPage, setCurrentPage] = useState('/');
  const router = useRouter();

  const pages = [
    {
      name: 'ColorGPT',
      url: '/colorgpt',
      color: '#ff0000',
    },
    {
      name: 'Album Art',
      url: '/album_art',
      color: '#0000ff',
    },
    {
      name: 'Randomizer',
      url: '/randomizer',
      color: '#00ff00',
    },
    //only show pricing if user is not subscribed
    {
      name: 'Pricing',
      url: '/pricing',
      color: '#0000ff',
    },
  ];

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 1,
        type: 'spring',
        delay: 1.0,
        stiffness: 40,
        tween: 'easeOut',
      }}
      className="fixed z-[30] top-0 w-screen flex h-max px-4 pt-10"
    >
      <div className="w-full md:w-3/5 items-center font-semibold justify-between rounded-full shadow-lg mx-auto top-0 h-12 pl-4 pr-2 md:pr-0  bg-white flex z-20">
        <div className="font-bold text-lg h-full">
          <Link href={'/'}>
            <HeaderLogo />
          </Link>
        </div>

        <div className="flex h-full py-[4px] ">
          {pages.map((page) =>
            //if user is subscribed remove pricing from navbar
            userFull?.is_subscribed && page.name === 'Pricing' ? null : (
              <div key={page.name} className="flex h-full gap-4">
                <div className="h-full hidden md:block">
                  <Link
                    className={`mx-1 group  relative flex items-center px-2 h-full`}
                    href={page.url}
                  >
                    {currentPage === page.url && (
                      <motion.div
                        layoutId="pill"
                        className="absolute z-[6] cursor-none  inset-0 border-[2px] border-blue-500/10 bg-blue-400/30"
                        style={{
                          borderRadius: '9999px',
                        }}
                        transition={{
                          duration: 0.5,
                          type: 'spring',
                        }}
                      ></motion.div>
                    )}
                    <span
                      className={`flex items-center bg-blend-exclusion text-black px-2 h-full z-10 transition-colors
                    ${currentPage === page.url ? 'text-blue-500' : 'text-black'}
                    `}
                    >
                      {page.name}
                    </span>
                  </Link>
                </div>
              </div>
            )
          )}
          {session ? (
            <div className="flex h-full gap-4">
              <div className="h-full hidden md:block">
                <Link
                  className={`mx-1 group text-neutral-800 relative flex items-center px-2 h-full`}
                  href="/library"
                >
                  {currentPage === '/library' && (
                    <motion.div
                      layoutId="pill"
                      className="absolute z-[6] cursor-none  inset-0 border-[2px] border-blue-500/10 bg-blue-400/30"
                      style={{
                        borderRadius: '9999px',
                      }}
                      transition={{
                        duration: 0.3,
                        type: 'spring',
                      }}
                    ></motion.div>
                  )}
                  <span
                    //if active page, make text white
                    className={`flex items-center bg-blend-exclusion text-black px-2 h-full z-10 transition-colors
                    ${
                      currentPage === '/library'
                        ? 'text-blue-500'
                        : 'text-black'
                    }
                    `}
                  >
                    Library
                  </span>
                </Link>
              </div>
              <div
                className={`tracking-tight flex items-center md:hidden h-full`}
              >
                <MobileNav />
              </div>
            </div>
          ) : (
            <div className="flex h-full">
              <Link
                className="relative group md:mr-[4px] h-full bg-black rounded-full text-white border-white/60 border-2  -mr-[4px] tracking-tight"
                href="/signup"
              >
                <motion.span
                  //make text bigger on hover
                  whileHover={{
                    fontSize: '14px',
                    paddingLeft: '38px',
                    paddingRight: '38px',
                  }}
                  //make text animate colors ON HOVER
                  transition={{
                    duration: 0.3,
                    type: 'spring',
                  }}
                  className={`flex relative items-center text-sm text-white px-4 h-full w-full z-20`}
                >
                  Try Rangeen
                </motion.span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
