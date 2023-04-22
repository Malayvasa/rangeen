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

  const pages = [
    {
      name: 'Randomizer',
      url: '/randomizer',
      color: '#00ff00',
    },
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
      className="fixed z-30 top-0 w-screen flex h-max px-4 pt-10"
    >
      <div className="w-full md:w-3/5 items-center font-semibold justify-between rounded-full shadow-lg mx-auto top-0 h-12 pl-4 pr-2 md:pr-0  bg-white flex z-20">
        <div className="font-bold text-lg h-full">
          <Link href={'/'}>
            <HeaderLogo />
          </Link>
        </div>

        <div className="flex h-full py-[4px] ">
          {pages.map((page) => (
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
          ))}
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
    </motion.div>
  );
}
