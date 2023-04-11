import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Color from 'color';

export default function Account({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState(null);
  const [palettes, setPalettes] = useState([]);
  const [randomNewPalette, setRandomNewPalette] = useState([]);

  useEffect(() => {
    getProfile();
    getPalettes();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getPalettes() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('palettes')
        .select(`name, colors`)
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
      getPalettes();
    }
  }

  //function to generate 10 random colors and add them to one array
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

    addRandomPalette(randomColors);
  }

  return (
    <div className="bg-stone-50 w-screen mx-auto px-8 text-gray-600">
      <div className="mx-auto mt-8 flex items-center justify-between">
        <div className="font-bold text-2xl">रंगीन</div>

        <div className="flex gap-4">
          <div className=" text-gray-800/40 ">{session.user.email}</div>
          <button
            className="button text-gray-600"
            onClick={() => supabase.auth.signOut()}
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
          </button>
        </div>
      </div>
      <div className="w-max mt-4 mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {palettes.map((palette) => {
            return (
              <div
                key={palette.name}
                className="bg-blue-200/10 rounded-xl flex md:gap-4"
              >
                {palette.colors.map((color) => {
                  return (
                    <div
                      key={color.hex}
                      className="bg-blue-400 h-8 w-8 w-full max-w-16"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <button
          className="bg-green-500/20 text-green-500 rounded-xl p-2 "
          onClick={() => {
            generateRandomColors();
          }}
        >
          generate new palette
        </button>
      </div>
    </div>
  );
}
