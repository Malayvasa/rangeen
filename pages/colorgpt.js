import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import Link from 'next/link';
import LogIn from '@/components/LogIn';

const ColorGPT = () => {
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState([]);
  const session = useSession();
  const [mood, setMood] = useState('dreamy vibes');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { push } = useRouter();
  const [formattedResponse, setFormattedResponse] = useState([]);
  const [hexList, setHexList] = useState([]);
  const [gptUsesRemaining, setGPTUsesRemaining] = useState(0);

  async function getFreeGPTUsesRemaining() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select('openai_generations')
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setGPTUsesRemaining(data[0].openai_generations);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateFreeGPTUsesRemaining() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .update({ openai_generations: gptUsesRemaining - 1 })
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setGPTUsesRemaining(data[0].openai_generations);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function addGPTPalette() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from('palettes').insert([
        {
          name: `${mood} - generated palette`,
          colors: hexList,
          user_id: user.id,
          type: 'colorgpt',
        },
      ]);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        notifyAddPalette();
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

  const getResponseFromOpenAI = async () => {
    setResponse('');
    setIsLoading(true);

    const prompt = `generate a color palette (in accrod with modern color theory) with 10 hex codes based on the mood: ${mood} ,uniquely name each color accordingly, format the response as a JSON and only return the JSON, the JSON should have two parameters, name and hex and the entire list should be inside colorPalette. Response :`;

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    setIsLoading(false);

    // try check if response is valid json and if not return an error
    let json;
    try {
      json = JSON.parse(data.text);

      // format the json
      const formatted = json.colorPalette.map((color) => {
        return {
          name: color.name,
          hex: color.hex,
        };
      });

      //function to check if a string is a valid hex code
      const isHex = (str) => {
        const regex = /^#([0-9A-F]{3}){1,2}$/i;
        return regex.test(str);
      };

      // filter out the colors that are not hex codes
      const filtered = formatted.filter((color) => {
        return isHex(color.hex);
      });

      const hexCodes = filtered.map((color) => color.hex);
      setHexList(hexCodes);

      console.log(filtered);
      setResponse(filtered);

      // update the number of uses remaining
      updateFreeGPTUsesRemaining();
      getFreeGPTUsesRemaining();
    } catch (e) {
      console.log('error');
      toast.error('Something went wrong, try again');
      return;
    }
  };

  useEffect(() => {
    getFreeGPTUsesRemaining();
  }, [session]);

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center p-4  md:py-32 md:px-32">
      <Toaster position="bottom-right" />
      {!session ? (
        <div className="w-full h-full bg-white flex flex-col justify-center items-center rounded-3xl pt-24 py-8 md:mt-0 md:py-12">
          <div className="mx-auto text-2xl mb-4 font-bold tracking-tight">
            ColorGPT
          </div>
          <div className="mx-auto text-lg text-center leading-tight">
            Use GPT to generate <br /> radiant color palettes
          </div>
          <div className="relative w-max bg-black">
            <Link
              href={'/login'}
              className="bg-white shadow-xl cta top-1/2 flex items-center justify-center w-16 h-16 text-blue-500 rounded-full z-[20]"
            >
              <svg
                width="32px"
                height="32px"
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
            </Link>
            <div className="blur-[25px] h-64 saturate-[200%] mt-8">
              <div className="loader1 left-1/2 top-1/2 z-10 "></div>
              <div className="loader2 left-1/2 top-1/2 z-10 "></div>
              <div className="loader3 left-1/2 top-1/2 z-10 "></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white flex-grow flex justify-center rounded-3xl pt-24 py-8 md:mt-0 md:py-12">
          <div className=" flex flex-col items-center justify-between ">
            <div className="flex gap-x-4 items-center border-[2px] rounded-full">
              <input
                onChange={(e) => {
                  setMood(e.target.value);
                }}
                placeholder="What's your mood?"
                className="p-4 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50"
              ></input>
              <button
                disabled={gptUsesRemaining === 0 ? true : false}
                onClick={() => {
                  getResponseFromOpenAI();
                }}
                // disabled button greyed out if no uses remaining
                className={`${
                  gptUsesRemaining === 0 ? ' text-gray-100' : ' text-blue-500'
                } p-2 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50`}
              >
                <svg
                  width="32px"
                  height="32px"
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
              </button>
            </div>
            <div className="p-2 px-4 text-sm bg-green-50 text-green-500 rounded-full mt-4">
              {gptUsesRemaining > 0
                ? `You have ${gptUsesRemaining} free uses remaining`
                : 'You have no free uses remaining'}
            </div>

            <div className="flex-grow h-full flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="blur-[15px] saturate-[200%] mt-8">
                    <div className="loader1 left-1/2 top-1/2 z-10 "></div>
                    <div className="loader2 left-1/2 top-1/2 z-10 "></div>
                    <div className="loader3 left-1/2 top-1/2 z-10 "></div>
                  </div>
                </>
              ) : (
                response.length > 0 && (
                  <div className="flex flex-col justify-center items-center">
                    <div className="grid grid-cols-2 md:flex gap-4 rounded-md p-4">
                      {response.map((color) => {
                        return (
                          <div
                            key={color.name}
                            className="group w-16 flex flex-col items-center gap-2"
                          >
                            <div
                              className="w-12 h-12 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <div className=" text-transparent group-hover:text-gray-300 transition-all duration-200">
                              {color.hex}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button>
                      <div
                        onClick={() => {
                          addGPTPalette();
                          toast.success('Palette added to your collection!');
                        }}
                        className="h-max w-max bg-slate-500/5 text-slate-500 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                      >
                        Save Palette
                      </div>
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorGPT;
