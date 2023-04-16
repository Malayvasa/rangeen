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
  const [randomNewPalette, setRandomNewPalette] = useState([]);

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

  useEffect(() => {
    generateRandomColors();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center px-4 py-4 md:py-32 md:px-32">
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;
