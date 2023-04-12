import { useEffect, useState } from 'react';
import Color from 'color';
import { motion } from 'framer-motion';

import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';

import LogIn from '@/components/LogIn';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [randomNewPalette, setRandomNewPalette] = useState([]);

  useEffect(() => {
    generateRandomColors();
  }, []);

  async function addRandomPalette(randomNewPalette) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from('palettes').insert([
        {
          name: 'random palette',
          colors: randomNewPalette,
          user_id: user.id,
        },
      ]);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //combine name and colors into one object and set it to palettes
        setPalettes(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function generateRandomColors() {
    let randomColors = [];
    for (let i = 0; i < 10; i++) {
      //generate values for r,g,b from 0 -255 and convert them to hex
      let randomColor = Color.rgb(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      ).hex();
      randomColors.push(randomColor);
    }

    console.log(randomColors);

    //sort the colors according to hue
    randomColors.sort((a, b) => {
      return Color(a).hue() - Color(b).hue();
    });

    setRandomNewPalette(randomColors);
  }

  return (
    <div className="">
      <div className="bg-stone-50 h-screen w-screen flex flex-col justify-center items-center">
        <div className="blur-[80px] md:blur-[120px] fixed z-10 top-1/2 left-1/2 saturate-[200%] ">
          <div className="circle1 left-1/2 top-1/2 z-10 "></div>
          <div className="circle2 left-1/2 top-1/2 z-10 "></div>
          <div className="circle3 left-1/2 top-1/2 z-10 "></div>
        </div>

        <motion.div className="font-bold text-8xl text-white mb-4 text-shadow mx-auto tracking-tighter z-20">
          रंगीन
        </motion.div>
        <motion.div className="text-center font-bold text-xl tracking-tight leading-tight text-white/60 mb-16 mx-auto z-20">
          a home for your colors
        </motion.div>
        <motion.div className="flex justify-center items-center z-20 bg-white shadow-lg p-8 rounded-lg w-max gap-4">
          {randomNewPalette.map((color) => {
            return (
              <div
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            );
          })}

          <button
            className="bg-slate-500/20 w-max text-slate-500 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
            onClick={() => {
              generateRandomColors();
            }}
          >
            <svg
              width="32px"
              height="32px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M22 7c-3 0-8.5 0-10.5 5.5S5 18 2 18"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M20 5l2 2-2 2M22 18c-3 0-8.5 0-10.5-5.5S5 7 2 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M20 20l2-2-2-2"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>

          {session ? (
            <button
              className="bg-slate-500/20 w-max text-slate-500 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
              onClick={() => {
                addRandomPalette(randomNewPalette);
              }}
            >
              <svg
                width="32px"
                height="32px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <path
                  d="M8 12h4m4 0h-4m0 0V8m0 4v4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
          ) : null}
        </motion.div>
      </div>
      {/* {!session ? <LogIn /> : <></>} */}
    </div>
  );
};

export default Home;
