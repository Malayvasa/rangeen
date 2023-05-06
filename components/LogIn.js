import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const supabase = useSupabaseClient();
  const { session, SignIn, SignOut, GetPalettes, DeletePalette } =
    useContext(Supabase_data);

  return (
    <div className="w-full md:w-[600px] items-center px-12 overflow-hidden flex flex-col m-auto">
      <motion.div
        initial={{ y: 0, opacity: 0, rotate: 0 }}
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
        <svg
          width="254"
          viewBox="0 0 84 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_49_19)">
            <path
              d="M81.2582 12.3296H54.1479V11.5185C54.1479 5.28826 51.2493 2.17261 45.4521 2.17261C42.3583 2.17261 40.1192 3.00552 38.7348 4.67136C37.3286 6.31538 36.6255 8.59812 36.6255 11.5185V12.3296H2.74281C1.22757 12.3296 0 13.5572 0 15.0714C0 16.5856 1.22757 17.8132 2.74281 17.8132H9.1839V18.6575C9.1839 19.7823 8.90245 20.6474 8.33956 21.2528C7.7777 21.8376 6.71734 22.1294 5.15952 22.1294C3.40333 22.1294 1.97948 23.5532 1.97948 25.3094V29.5602C1.97948 30.901 2.27235 32.113 2.85601 33.1941C3.43968 34.2545 4.2944 35.0978 5.41915 35.725C6.56571 36.3316 7.93971 36.6338 9.54012 36.6338C11.7688 36.6338 13.4991 36.0065 14.7318 34.7519C15.9874 33.4974 16.6147 31.7993 16.6147 29.6568C16.6147 29.1801 16.2149 28.8135 15.7371 28.8135H11.3254C10.7334 28.8135 10.2546 29.2933 10.2546 29.8842C10.2546 30.2093 10.1788 30.4793 10.0272 30.6953C9.89738 30.9124 9.69175 31.0204 9.4103 31.0204C8.82664 31.0204 8.5348 30.6413 8.5348 29.8842V27.3855C11.2381 27.2349 13.121 26.3802 14.1804 24.8223C15.2625 23.2645 15.8036 21.2092 15.8036 18.6575V17.8132H26.9763V24.5305C26.9763 25.0716 26.9005 25.5151 26.7489 25.8609C26.6191 26.1849 26.3491 26.348 25.9378 26.348C25.5265 26.348 25.2347 26.1963 25.0612 25.8931C24.9096 25.5691 24.8348 25.1142 24.8348 24.5305C24.8348 23.9468 24.3696 23.492 23.7963 23.492H19.5133C18.9068 23.492 18.4093 23.9562 18.4093 24.5627C18.4093 27.0075 19.0802 28.8571 20.421 30.1117C21.7846 31.3444 23.6883 31.9613 26.132 31.9613C28.5757 31.9613 30.4804 31.2582 31.7132 29.852C32.9677 28.4458 33.5961 26.5744 33.5961 24.2387V17.8132H36.613V34.7582C36.613 35.6326 37.3224 36.3419 38.1968 36.3419H41.65C42.5245 36.3419 43.2328 35.6326 43.2328 34.7582V17.8132H47.5282V34.7582C47.5282 35.6326 48.2375 36.3419 49.112 36.3419H52.5641C53.4396 36.3419 54.1479 35.6326 54.1479 34.7582V17.8132H74.8815V20.4095H65.8607C64.3465 20.4095 62.9621 20.6796 61.7075 21.2207C60.453 21.7399 59.4466 22.551 58.6895 23.654C57.9542 24.758 57.5866 26.1205 57.5866 27.7427C57.5866 29.257 57.9438 30.577 58.6573 31.7017C59.3926 32.8046 60.3449 33.649 61.5133 34.2326C62.7025 34.7955 63.9684 35.076 65.3092 35.076C66.65 35.076 67.7976 34.8381 68.8787 34.3625C69.9609 33.8868 70.826 33.1723 71.4751 32.221C72.1231 31.2479 72.4482 30.0577 72.4482 28.6515C72.4482 27.6347 72.2748 26.7156 71.9289 25.8931H74.8815V34.7582C74.8815 35.6326 75.5909 36.3419 76.4653 36.3419H79.9185C80.793 36.3419 81.5013 35.6326 81.5013 34.7582V17.8132C82.8815 17.8132 84 16.6947 84 15.3144V15.0714C84 13.5572 82.7724 12.3296 81.2582 12.3296ZM47.7234 12.3296H43.05V11.1935C43.05 10.2421 43.2016 9.43103 43.5049 8.76013C43.8071 8.06742 44.4562 7.72158 45.4521 7.72158C46.3816 7.72158 46.9882 8.06742 47.2686 8.76013C47.5718 9.43103 47.7234 10.2421 47.7234 11.1935V12.3296ZM66.705 29.0409C66.38 29.365 65.9479 29.528 65.4068 29.528C64.8658 29.528 64.3901 29.365 64.0443 29.0409C63.6974 28.6951 63.525 28.2516 63.525 27.7106C63.525 27.1695 63.6974 26.7582 64.0443 26.4124C64.4119 26.0665 64.8658 25.8931 65.4068 25.8931C65.9479 25.8931 66.38 26.0665 66.705 26.4124C67.0509 26.7582 67.2233 27.1913 67.2233 27.7106C67.2233 28.2298 67.0509 28.6951 66.705 29.0409Z"
              fill="white"
            />
            <path
              d="M12.0689 0.363406C12.4989 0.115193 13.0286 0.115193 13.4585 0.363406L16.1941 1.94304C16.624 2.19125 16.8889 2.65029 16.8889 3.14672V6.30599C16.8889 6.80242 16.624 7.26145 16.1941 7.50967L13.4585 9.0893C13.0286 9.33752 12.4989 9.33752 12.0689 9.0893L9.3334 7.50967C8.90344 7.26145 8.63861 6.80242 8.63861 6.30599V3.14672C8.63861 2.65029 8.90344 2.19125 9.3334 1.94304L12.0689 0.363406Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_49_19">
              <rect
                width="84"
                height="36.4562"
                fill="white"
                transform="translate(0 0.17749)"
              />
            </clipPath>
          </defs>
        </svg>
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
        className="text-center font-semibold text-xl tracking-tight leading-tight text-white/60 mb-16 mx-auto z-20"
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
        className="z-20 bg-white items-center p-8 mx-32 w-full max-w-96 rounded-3xl flex flex-col gap-4"
      >
        <input
          type="username"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="p-4 border-2 rounded-lg w-full"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="p-4 border-2 rounded-lg w-full"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="p-4 w-full bg-black/80 mt-8 text-lg rounded-md font-bold text-white"
          onClick={async () => {
            let error = await SignIn(email, password);
            if (error) {
              setError(error);
            }
          }}
        >
          Log In
        </button>
        <Link href={'/signup'}>
          <div className="text-black/40 text-sm font-semibold hover:text-black">
            {"Don't have an account? Sign up here."}
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
