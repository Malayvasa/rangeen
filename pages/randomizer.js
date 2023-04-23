import { useEffect, useState } from 'react';
import Color from 'color';
import { motion } from 'framer-motion';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import ExportModal from '@/components/ExportModal';

const Randomizer = ({}) => {
  const [randomNewPalette, setRandomNewPalette] = useState([]);
  const [currentHexList, setCurrentHexList] = useState([]);
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

    //create new array of color objects that have hex and locked state
    // by default, all colors are unlocked
    let newRandomColors = randomColors.map((color) => {
      return { hex: color, locked: false };
    });

    //if randomNewPalette is empty, set the new random colors
    if (randomNewPalette.length === 0) {
      setRandomNewPalette(newRandomColors);
    } else {
      //if randomNewPalette is not empty, replace the unlocked colors with the new random colors
      let newPalette = [...randomNewPalette];
      for (let i = 0; i < newPalette.length; i++) {
        if (!newPalette[i].locked) {
          newPalette[i].hex = newRandomColors[i].hex;
        }
      }
      setRandomNewPalette(newPalette);
    }
  }

  useEffect(() => {
    //get hex values from the palette and set it to currentHexList
    let hexList = [];
    randomNewPalette.forEach((color) => {
      hexList.push(color.hex);
    });
    setCurrentHexList(hexList);
  }, [randomNewPalette]);

  useEffect(() => {
    generateRandomColors();
    console.log(randomNewPalette);
  }, []);

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemUp = {
    hidden: { y: -5, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const itemDown = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center px-4 py-4 md:py-12 md:px-12">
      <div></div>

      <div className="bg-white rounded-3xl shadow-sm w-full h-full flex flex-col justify-center items-center">
        <div className="flex w-full mx-2 flex-col justify-center items-center">
          {randomNewPalette && (
            <motion.div
              key={randomNewPalette}
              variants={container}
              initial="hidden"
              animate="show"
              className="mx-2 w-[250px] md:w-[650px] lg:w-[1000px] md:h-96 flex flex-col md:flex-row gap-2 justify-evenly"
            >
              {randomNewPalette.map((color, index) => {
                return (
                  <motion.div
                    variants={itemDown}
                    key={color}
                    className="group flex w-full flex-col items-center gap-2"
                  >
                    <div
                      //if the color is dark, add a white border to it
                      className={`w-full flex-grow h-12 md:h-96 rounded-full flex justify-center items-center ${
                        Color(color.hex).isDark()
                          ? 'hover:border-8 border-gray-200/40'
                          : 'hover:border-8 border-gray-800/40'
                      } transition-all`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        console.log(Color(color.hex).darken(0.5).hex());
                        let newColors = [...randomNewPalette];
                        newColors[index].locked = !newColors[index].locked;
                        setRandomNewPalette(newColors);
                      }}
                    >
                      {color.locked ? (
                        <div className="">
                          <svg
                            width="32px"
                            height="32px"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color={`${
                              Color(color.hex).isDark()
                                ? Color(color.hex).lighten(0.4).hex()
                                : Color(color.hex).darken(0.4).hex()
                            } `}
                          >
                            <path
                              d="M16 12h1.4a.6.6 0 01.6.6v6.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6v-6.8a.6.6 0 01.6-.6H8m8 0V8c0-1.333-.8-4-4-4S8 6.667 8 8v4m8 0H8"
                              stroke={`${
                                Color(color.hex).isDark()
                                  ? Color(color.hex).lighten(0.4).hex()
                                  : Color(color.hex).darken(0.4).hex()
                              } `}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        <div className="group-hover:opacity-100 opacity-0">
                          <svg
                            width="32px"
                            height="32px"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color={`${
                              Color(color.hex).isDark()
                                ? Color(color.hex).lighten(0.7).hex()
                                : Color(color.hex).darken(0.5).hex()
                            } `}
                          >
                            <path
                              d="M16 12h1.4a.6.6 0 01.6.6v6.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6v-6.8a.6.6 0 01.6-.6H8m8 0V8c0-1.333-.8-4-4-4S8 6.667 8 8v4m8 0H8"
                              stroke={`${
                                Color(color.hex).isDark()
                                  ? Color(color.hex).lighten(0.7).hex()
                                  : Color(color.hex).darken(0.5).hex()
                              } `}
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
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
                    currentHexList,
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

            <ExportModal hexList={currentHexList}>
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
        </div>
      </div>
      {/* {!session ? <LogIn /> : <></>} */}
    </div>
  );
};

export default Randomizer;
