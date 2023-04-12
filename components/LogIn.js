import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

export default function LogIn() {
  const supabase = useSupabaseClient();

  return (
    <div className="w-[400px] flex flex-col m-auto">
      <motion.div
        initial={{ y: 0, opacity: 0, rotate: 270 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 2, type: 'spring', type: 'tween' }}
        className="blur-[80px] md:blur-[120px] fixed z-10 top-1/2 left-1/2 saturate-[200%] "
      >
        <div className="circle1 left-1/2 top-1/2 z-10 "></div>
        <div className="circle2 left-1/2 top-1/2 z-10 "></div>
        <div className="circle3 left-1/2 top-1/2 z-10 "></div>
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          type: 'spring',
          delay: 1.5,
          stiffness: 40,
          tween: 'easeOut',
        }}
        className="font-bold text-8xl text-white mb-4 text-shadow mx-auto tracking-tighter z-20"
      >
        रंगीन
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          type: 'spring',
          delay: 1.5,
          stiffness: 40,
          tween: 'easeOut',
        }}
        className="text-center font-bold text-xl tracking-tight leading-tight text-white/60 mb-16 mx-auto z-20"
      >
        a home for your colors
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1.7,
          type: 'spring',
          stiffness: 20,
        }}
        className="bg-transparent mix-blend-screen md:bg-white/50 p-8 rounded-3xl z-20 mx-4 md:mx-0"
      >
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              anchor: {
                fontFamily: 'Manrope',
                textDecoration: 'none',
                color: 'white',
              },
              button: {
                background: 'black',
                color: 'white',
                border: 'none',
                fontFamily: 'Manrope',
              },
              input: {
                background: '#F9FAFB',
                color: 'black',
                fontFamily: 'Manrope',
                border: 'none',
              },
              label: {
                display: 'none',
                color: 'white',
              },
              //..
            },
          }}
          theme="dark"
          providers={[]}
        />
      </motion.div>
    </div>
  );
}
