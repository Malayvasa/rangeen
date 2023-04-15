import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Color from 'color';

export default function SavedPalettes({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState([]);
  const [palettesCount, setPalettesCount] = useState(0);

  useEffect(() => {
    getPalettes();
  }, [session]);

  async function getPalettes() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('palettes')
        .select(`id,name, colors,type`)
        .eq('user_id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //combine name and colors into one object and set it to palettes
        setPalettes(data);

        //count the number of palettes
        setPalettesCount(data.length);

        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePalette(palette) {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('palettes')
        .delete()
        .eq('id', palette.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      getPalettes();
    }
  }

  return (
    <div>
      <div className="w-full md:w-full flex flex-col gap-4">
        <div className="text-xl justify-between w-full tracking-tight flex mb-4">
          <div className="flex gap-2 items-center justify-center font-bold text-gray-500">
            Saved palettes
            {loading ? (
              <div className="text-sm ml-2 text-gray-300">Loading</div>
            ) : (
              <div>({palettesCount})</div>
            )}
          </div>
          <div className="hidden md:block text-gray-300">
            {session.user.email}
          </div>
        </div>
        {palettes.map((palette) => {
          return (
            <div className="flex">
              <Link
                href={`/palette/${palette.id}`}
                key={palette.id}
                className=" gap-y-4 flex justify-center items-center relative bg-white shadow-sm p-4 rounded-md md:gap-4"
              >
                {palette.type === 'colorgpt' && (
                  <div className="hidden md:visible md:flex justify-center gap-2 items-center text-blue-700 bg-blue-500/10 absolute rounded-full p-2 left-0 -translate-x-[130%]">
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="currentColor"
                    >
                      <path
                        d="M3 21l10-10m5-5l-2.5 2.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9.5 2l.945 2.555L13 5.5l-2.555.945L9.5 9l-.945-2.555L6 5.5l2.555-.945L9.5 2zM19 10l.54 1.46L21 12l-1.46.54L19 14l-.54-1.46L17 12l1.46-.54L19 10z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <div className="pr-2">ColorGPT</div>
                  </div>
                )}
                {palette.colors.map((color) => {
                  return (
                    <div
                      key={color.hex}
                      className="w-10 h-10 md:rounded-full"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                  );
                })}
              </Link>
              <button
                className="hidden md:block bg-slate-200/20 w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                onClick={() => {
                  deletePalette(palette);
                }}
              >
                <svg
                  width="18px"
                  height="18px"
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
          );
        })}
      </div>
    </div>
  );
}
