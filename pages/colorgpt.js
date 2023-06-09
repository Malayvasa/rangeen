import { useState, useEffect } from 'react';
import { Supabase_data } from '@/context/supabaseContext';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';

const ColorGPT = () => {
  const { supabase, user, userFull, loading, session, AddPaletteToLibrary } =
    useContext(Supabase_data);
  const [gptloading, setGPTLoading] = useState(true);
  const [response, setResponse] = useState([]);
  const [mood, setMood] = useState('dreamy vibes');
  const [isLoading, setIsLoading] = useState(false);
  const [hexList, setHexList] = useState([]);
  const [gptUsesRemaining, setGPTUsesRemaining] = useState(0);
  const [justification, setJustification] = useState('');
  const posthog = usePostHog();

  async function getFreeGPTUsesRemaining() {
    try {
      setGPTLoading(true);
      let { data, error, status } = await supabase
        .from('profiles')
        .select('openai_generations')
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setGPTUsesRemaining(data[0].openai_generations);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGPTLoading(false);
    }
  }

  async function updateFreeGPTUsesRemaining() {
    try {
      setGPTLoading(true);

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
      setGPTLoading(false);
      getFreeGPTUsesRemaining();
    }
  }

  const getResponseFromOpenAI = async () => {
    setResponse('');
    setIsLoading(true);

    const prompt = `You are colorGPT an expert in color theory and color science, generate a color palette with 10 hex codes based on the prompt: ${mood}. Generate the color palette to follow one of the following color scheme styles that works for the given prompt : Analogous, Monochromatic, Complementary,  Triadic, Split-Complementary, Tetradic, Neutral, Warm/Cool, Pastel, Retro/Vintage. Choose the scheme that applies the best to the given prompt. Also give a "justification" field justifying why this palette works for this particular prompt. Do not include any nextline or breaklne characters and  format the response as a JSON and only return the JSON structured exactly like {"colors":[],"justification":" "}  Response:`;
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    console.log(data.text);
    setIsLoading(false);
    setResponse(data.text);
    try {
      const json = JSON.parse(data.text);
      console.log(json);
      setResponse(json.colors);
      setJustification(json.justification);
      updateFreeGPTUsesRemaining();
      getFreeGPTUsesRemaining();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong, try again');
      return;
    }

    // // try check if response is valid json and if not return an error
    // let json;
    // try {
    //   json = JSON.parse(data.text);

    //   // format the json
    //   const formatted = json.colorPalette.map((color) => {
    //     return {
    //       name: color.name,
    //       hex: color.hex,
    //     };
    //   });

    //   //function to check if a string is a valid hex code
    //   const isHex = (str) => {
    //     const regex = /^#([0-9A-F]{3}){1,2}$/i;
    //     return regex.test(str);
    //   };

    //   // filter out the colors that are not hex codes
    //   const filtered = formatted.filter((color) => {
    //     return isHex(color.hex);
    //   });

    //   const hexCodes = filtered.map((color) => color.hex);
    //   setHexList(hexCodes);
    //   console.log(filtered);
    //   setResponse(filtered);

    //   // update the number of uses remaining
    // updateFreeGPTUsesRemaining();
    // getFreeGPTUsesRemaining();
    // } catch (e) {
    //   console.log('error');
    // toast.error('Something went wrong, try again');
    // return;
    // }
  };

  useEffect(() => {
    getFreeGPTUsesRemaining();
  }, [session]);

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-100 items-center p-4  md:py-32 md:px-32">
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
                // make it so that get response is called when enter is pressed
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    {
                      gptUsesRemaining === 0
                        ? toast.error('No uses remaining')
                        : getResponseFromOpenAI();
                    }
                  }
                }}
                placeholder="What's your mood?"
                className="p-4 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50"
              ></input>
              <button
                disabled={gptUsesRemaining === 0 ? true : false}
                onClick={() => {
                  getResponseFromOpenAI();
                  posthog.capture('Color GPT', {
                    property: mood,
                  });
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
            {!loading && userFull && (
              <div className="p-2 px-4 text-sm bg-green-50 text-green-500 rounded-full mt-4">
                {gptUsesRemaining > 0 &&
                  !userFull.is_subscribed &&
                  `${gptUsesRemaining} Free Uses Remaining`}
                {gptUsesRemaining > 0 &&
                  userFull.is_subscribed &&
                  `${gptUsesRemaining} Uses Remaining`}
                {gptUsesRemaining === 0 && !userFull?.is_subscribed && (
                  <div className="flex items-center gap-x-2">
                    <div className="text-red-500">0 Uses Remaining</div>
                    <Link href="/pricing">
                      <button className="text-blue-500 underline">
                        Upgrade to get more
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

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
                    <div className="grid grid-cols-2 md:flex gap-2 rounded-md p-4">
                      {response.map((color) => {
                        return (
                          <div
                            key={color.name}
                            className="group flex flex-col items-center "
                          >
                            <div
                              className="w-12 h-12 rounded-full"
                              style={{ backgroundColor: color }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="bg-slate-500/20 w-max text-slate-500 flex items-center gap-2 rounded-md p-2 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                      onClick={() => {
                        // addGPTPalette();
                        let hexList = response.map((color) => color);
                        AddPaletteToLibrary(
                          `${mood} - Generated Palette`,
                          hexList,
                          'colorgpt'
                        );
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
                      <div>Save to Library</div>
                    </button>

                    <div className="flex flex-col mt-16 m-8 w-96 bg-gray-200 rounded-md">
                      <div className="text-sm py-2 text-center font-semibold   text-gray-700">
                        Why this palette?
                      </div>
                      <div className=" text-left p-[12px] text-sm w-96 rounded-md bg-gray-100 text-gray-500">
                        {justification}
                      </div>
                    </div>
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
