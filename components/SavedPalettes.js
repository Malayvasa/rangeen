import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import ExportModal from './ExportModal';
import Color from 'color';
import Iconoir from 'iconoir/icons/iconoir.svg';
import { toast } from 'react-hot-toast';
import { usePostHog } from 'posthog-js/react';

export default function SavedPalettes({}) {
  const [filter, setFilter] = useState('all');
  const [filteredPalettes, setFilteredPalettes] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const { session, SignOut, GetPalettes, DeletePalette } =
    useContext(Supabase_data);
  const posthog = usePostHog();

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

  function copyPalleteLink(id) {
    const el = document.createElement('textarea');
    el.value = `https://rangeen.studio/palette/${id}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast.success('Link copied to clipboard!', {
      duration: 5000,
    });
    posthog.capture('Palette Shared', {
      property: `https://rangeen.studio/palette/${id}`,
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
    <div className="mt-8 rounded-3xl h-full w-full">
      {palettes.length > 0 ? (
        <>
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
            // if only one palette, have one column, else have two
            className={`${
              filteredPalettes.length === 1 || filteredPalettes.length === 0
                ? 'grid-cols-1'
                : 'grid-cols-2'
            } w-full grid gap-8`}
          >
            {filteredPalettes.map((palette) => {
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
                          onClick={() => {
                            copyPalleteLink(palette.id);
                          }}
                          className="flex justify-center items-center gap-2 w-max  bg-slate-200/20 hover:bg-slate-900 text-slate-400 rounded-md p-2  hover:text-slate-100 transition-all duration-200"
                        >
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
                              d="M18 22a3 3 0 100-6 3 3 0 000 6zM18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6z"
                              stroke="currentColor"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M15.5 6.5l-7 4M8.5 13.5l7 4"
                              stroke="currentColor"
                              stroke-width="1.5"
                            ></path>
                          </svg>
                        </button>
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
            {
              //if no filtered palettes, show empty state
              filteredPalettes.length === 0 && (
                <div className="flex flex-col border-t-2 pt-8 w-full items-center justify-center gap-4">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-slate-400 text-md">
                      No Saved Palettes
                    </h1>
                  </div>
                  <Link
                    //set href to selected filter
                    href={`${
                      filter === 'random' ? '/randomizer' : `/${filter}`
                    }`}
                  >
                    <button className="mt-4 shadow-lg z-20 w-max bg-blue-500 text-white rounded-lg px-4 py-2">
                      <span className="text-lg">Start Generating</span>
                    </button>
                  </Link>
                </div>
              )
            }
          </motion.div>
        </>
      ) : (
        <></>
      )}

      {
        //if no palettes, show empty state
        palettes.length === 0 && (
          <div className="flex flex-col border-t-2 pt-8 w-full items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-slate-400 text-md">No Saved Palettes</h1>
            </div>
            <Link href="/colorgpt">
              <button className="mt-4 shadow-lg z-20 w-max bg-blue-500 text-white rounded-lg px-4 py-2">
                <span className="text-lg">Start Generating</span>
              </button>
            </Link>
          </div>
        )
      }
    </div>
  );
}
