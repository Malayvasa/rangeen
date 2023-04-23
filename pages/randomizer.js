import { useEffect, useState } from 'react';
import Color from 'color';
import { motion } from 'framer-motion';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import ExportModal from '@/components/ExportModal';

const Randomizer = ({}) => {
  const [randomNewPalette, setRandomNewPalette] = useState([]);
  const { session, AddPaletteToLibrary } = useContext(Supabase_data);

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

  useEffect(() => {
    generateRandomColors();
    console.log(randomNewPalette);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center px-4 py-4 md:py-32 md:px-32">
      <div></div>

      <div className="bg-white rounded-3xl shadow-sm w-full h-full flex flex-col justify-center items-center">
        <motion.div className="flex w-full flex-col justify-center items-center">
          <div className="grid grid-cols-2 md:flex w-max justify-evenly">
            {randomNewPalette.map((color) => {
              return (
                <div
                  key={color}
                  className="group max-w-16 flex flex-col items-center gap-2"
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
          <div className="flex gap-8 mt-8 justify-evenly">
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
                onClick={async () => {
                  // addRandomPalette(randomNewPalette);
                  const result = await AddPaletteToLibrary(
                    'Random Palette',
                    randomNewPalette,
                    'random'
                  );
                  console.log(result);
                  // notifyAddPalette(result);
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

            <ExportModal hexList={randomNewPalette}>
              <button className="bg-slate-500/20 w-max text-slate-500 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
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
                    d="M6 20h12M12 4v12m0 0l3.5-3.5M12 16l-3.5-3.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </ExportModal>
          </div>
        </motion.div>
      </div>
      {/* {!session ? <LogIn /> : <></>} */}
    </div>
  );
};

export default Randomizer;
