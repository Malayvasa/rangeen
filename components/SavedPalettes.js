import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Color from 'color';

export default function SavedPalettes({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    getPalettes();
  }, [session]);

  async function getPalettes() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('palettes')
        .select(`id,name, colors`)
        .eq('user_id', user.id);

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
    <div className="w-max flex flex-col gap-4">
      {palettes.map((palette) => {
        return (
          <div
            key={palette.id}
            className="flex bg-neutral-100 p-4 rounded-md md:gap-4"
          >
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
            <button
              className="bg-slate-200/20 w-max text-slate-400 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
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
  );
}
