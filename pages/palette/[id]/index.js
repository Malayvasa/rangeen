import { useRouter } from 'next/router';
import Color from 'color';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function Palette() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [palette, setPalette] = useState({
    id: 0,
    name: 'Loading...',
    colors: [
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
    ],
    type: 'loading',
  });

  const pid = router.query.id;

  useEffect(() => {
    async function getPalette(pid) {
      try {
        setLoading(true);

        //   //convert id to signed 8bit integer
        //   pid = parseInt(pid);

        let { data, error, status } = await supabase
          .from('palettes')
          .select(`id,name, colors,type`)
          .eq('id', pid);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          //combine name and colors into one object and set it to palettes
          setPalette(data[0]);
          console.log(data[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getPalette(pid);
  }, [pid]);

  return (
    !loading && (
      <div className="flex justify-center bg-gray-100 min-h-screen">
        <div className="h-full py-32 md:p-32">
          <div className="flex flex-col gap-8 items-center justify-center">
            {palette.type === 'colorgpt' && (
              <div className="flex justify-center gap-2 items-center text-blue-700 bg-blue-500/10 rounded-full p-4">
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
                <div className="font-bold">Generated Using ColorGPT</div>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {palette.colors.map((color) => {
                //convert hex to rgb
                let rgb = Color(color).rgb().array();

                return (
                  <div
                    key={color}
                    className="bg-white w-44 px-2 h-52 shadow-md"
                  >
                    <div
                      className="w-full h-32 mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="mx-2 mt-2 text-gray-200">
                      <span className=" text-gray-400">{color}</span>
                    </div>
                    <div className="mx-2 text-gray-200">
                      <span className="text-gray-400">
                        {rgb[0]}, {rgb[1]}, {rgb[2]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
