import { useEffect, useState } from 'react';
import Color from 'color';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

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
  const [randomNewPalette, setRandomNewPalette] = useState([
    '#1eff85',
    '#3af3ffdf',
    '#1c18e6a3',
    '#fa1eff',
    '#ff813a',
    '#ffeb3a',
    '#ff3a3a',
  ]);

  async function addRandomPalette(randomNewPalette) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from('palettes').insert([
        {
          name: 'random palette',
          colors: randomNewPalette,
          user_id: user.id,
          type: 'random',
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
    //use the first six colors to change the css root variables
    let root = document.documentElement;
    root.style.setProperty('--background1-hex', randomColors[0]);
    root.style.setProperty('--background2-hex', randomColors[1]);
    root.style.setProperty('--background3-hex', randomColors[2]);
    root.style.setProperty('--background4-hex', randomColors[3]);
    root.style.setProperty('--background5-hex', randomColors[4]);
    root.style.setProperty('--background6-hex', randomColors[5]);
    root.style.setProperty('--background7-hex', randomColors[6]);
    root.style.setProperty('--background8-hex', randomColors[7]);
    root.style.setProperty('--background9-hex', randomColors[8]);
    root.style.setProperty('--background10-hex', randomColors[9]);
  }

  function notifyAddPalette() {
    toast.success('Added to your palettes');
  }

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center  py-32 px-32">
      <Toaster position="bottom-right" />

      <div className="bg-white rounded-3xl shadow-sm z-20 w-full h-full flex flex-col justify-center items-center">
        {/* <motion.div className="font-bold text-8xl text-white mb-4 text-shadow mx-auto tracking-tighter z-20">
          रंगीन
        </motion.div> */}
        {/* <motion.div className="text-center font-bold text-xl tracking-tight leading-tight text-white/60 mb-16 mx-auto z-20">
          a home for your colors
        </motion.div> */}
        <motion.div className="flex flex-col justify-center items-center z-20  p-8 rounded-lg w-max gap-4">
          <div className="flex gap-8">
            {randomNewPalette.map((color) => {
              return (
                <div
                  key={color}
                  className="group w-16 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className=" text-transparent group-hover:text-gray-300 transition-all duration-200">
                    {color}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-8">
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
                  notifyAddPalette();
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
          </div>
        </motion.div>
      </div>
      {/* {!session ? <LogIn /> : <></>} */}
    </div>
  );
};

export default Home;
