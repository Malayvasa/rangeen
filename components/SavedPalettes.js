import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import ExportModal from './ExportModal';
import Color from 'color';

export default function SavedPalettes({}) {
  const [filter, setFilter] = useState('all');
  const [filteredPalettes, setFilteredPalettes] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const { session, SignOut, GetPalettes, DeletePalette } =
    useContext(Supabase_data);

  const filterTypes = [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Random',
      value: 'random',
    },
    {
      name: 'Color GPT',
      value: 'colorgpt',
    },
    {
      name: 'Album Art',
      value: 'album_art',
    },
  ];

  useEffect(() => {
    GetPalettes().then((data) => {
      setPalettes(data);
    });
  }, [session]);

  async function deletePalette(palette) {
    DeletePalette(palette).then((data) => {
      GetPalettes().then((data) => {
        setPalettes(data);
      });
    });
  }

  function ButtonBorderColorPicker(color) {
    let bg = Color(color);
    //return a new color with same hue but 90% saturation and 90% lightness
    let newColor = Color({
      h: bg.hue(),
      s: 90,
      l: 75,
    });

    return newColor.hex();
  }

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPalettes(palettes);
    } else {
      let filtered = palettes.filter((palette) => {
        return palette.type === filter;
      });
      setFilteredPalettes(filtered);
    }
  }, [filter, palettes]);

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemUp = {
    hidden: { y: -5, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className=" rounded-3xl h-full w-full">
      <div className=" w-full text-center my-4 mt-8 tracking-tight font-bold text-3xl">
        Library
      </div>
      <div className="flex w-full gap-2 justify-center items-center px-12 mb-16">
        {filterTypes.map((filterType) => {
          return (
            <div key={filterType.value}>
              <button
                className={`${
                  filter === filterType.value
                    ? 'border-slate-500 bg-slate-900 text-slate-100'
                    : 'border-slate-500/30 text-slate-500/30'
                }  h-10 w-max p-4 rounded-full text-sm md:text font-semibold border-[2px] flex items-center justify-center`}
                onClick={() => {
                  setFilter(filterType.value);
                }}
              >
                {filterType.name}
              </button>
            </div>
          );
        })}
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* <div className="text-xl justify-between gap-4 w-full tracking-tight flex mb-4">
          <div className="flex gap-2 items-center justify-center font-semibold text-gray-500">
            Saved palettes
            <div>({palettes.length})</div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-gray-400">
            {session.user.email}
            <div
              title="Sign out"
              className="bg-slate-500/5 w-max text-slate-300 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
              onClick={() => {
                SignOut();
              }}
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
            </div>
          </div>
        </div> */}
        {filteredPalettes.map((palette) => {
          console.log(palette);
          return (
            <motion.div
              variants={itemUp}
              layoutId={`${palette.id}`}
              className="flex gap-2"
              key={palette.id}
            >
              <div className=" gap-y-4 w-full min-w-full flex flex-col justify-between items-start relative bg-white hover:shadow-xl transition-all shadow-sm py-4 rounded-md md:gap-4">
                <div className="text-gray-400 px-4 capitalize">
                  {palette.name}
                </div>

                <div className="flex flex-wrap md:flex-auto my-2 gap-1 px-4">
                  {palette.colors.map((color) => {
                    return (
                      <div
                        key={color.hex}
                        className="w-10 h-10 rounded-full"
                        style={{
                          backgroundColor: color,
                        }}
                      ></div>
                    );
                  })}
                  {
                    // if palette length is less than 10, add as many empty colors as needed to make it 10
                    palette.colors.length < 10 &&
                      Array.from(Array(10 - palette.colors.length)).map(
                        (e, i) => {
                          return (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full bg-transparent"
                            ></div>
                          );
                        }
                      )
                  }
                </div>

                <div className="flex flex-row px-4 gap-2 w-full border-t-[1px] pt-4 items-center justify-center">
                  <div className="flex flex-grow w-full">
                    <Link href={`/palette/${palette.id}`}>
                      <button className="flex justify-center items-center gap-2 w-max  bg-slate-200/20 hover:bg-slate-900 text-slate-400 rounded-md p-2  hover:text-slate-100 transition-all duration-200">
                        <svg
                          width="20px"
                          height="20px"
                          stroke-width="1.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          color="currentColor"
                        >
                          <path
                            d="M12 14a2 2 0 100-4 2 2 0 000 4z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M21 12c-1.889 2.991-5.282 6-9 6s-7.111-3.009-9-6c2.299-2.842 4.992-6 9-6s6.701 3.158 9 6z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                        <span className="text-xs">View Details</span>
                      </button>
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <ExportModal hexList={palette.colors}>
                      <button className="flex justify-center items-center gap-2 bg-slate-200/20 h-full w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
                        <svg
                          width="18px"
                          height="18px"
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
                        <span className="text-xs">Export</span>
                      </button>
                    </ExportModal>
                    <button
                      className="flex justify-center items-center gap-2 bg-slate-200/20 w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                      onClick={() => {
                        deletePalette(palette);
                      }}
                    >
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="currentColor"
                      >
                        <path
                          d="M20 9l-1.995 11.346A2 2 0 0116.035 22h-8.07a2 2 0 01-1.97-1.654L4 9M21 6h-5.625M3 6h5.625m0 0V4a2 2 0 012-2h2.75a2 2 0 012 2v2m-6.75 0h6.75"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
