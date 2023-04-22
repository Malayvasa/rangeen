import { ColorExtractor } from 'react-color-extractor';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const AlbumArt = () => {
  const user = useUser();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState({
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of',
        },
        href: 'https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of',
        id: '0LyfQWJT6nXafLPZqxe9Of',
        name: 'Joji',
        type: 'artist',
        uri: 'spotify:artist:0LyfQWJT6nXafLPZqxe9Of',
      },
    ],
    name: 'Afterthought',
    id: '3MZsBdqDrRTJihTHQrO6Dq',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27353f6fa0d2589c6a7174f4b81',
      },
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27353f6fa0d2589c6a7174f4b81',
      },
    ],
  });
  const [searchString, setSearchString] = useState('');
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState([]);
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hexList, setHexList] = useState([]);
  const [freeSpotifyUsesRemaining, setFreeSpotifyUsesRemaining] = useState(0);

  async function getFreeSpotifyUsesRemaining() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select('spotify_generations')
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFreeSpotifyUsesRemaining(data[0].spotify_generations);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateFreeSpotifyUsesRemaining() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .update({ spotify_generations: freeSpotifyUsesRemaining - 1 })
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFreeSpotifyUsesRemaining(data[0].spotify_generations);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      getFreeSpotifyUsesRemaining();
    }
  }

  useEffect(() => {
    getFreeSpotifyUsesRemaining();
  }, [session]);

  let GetData = async () => {
    let tokenres = await fetch('/api/spotify?token=true', {
      method: 'POST',
    });

    let tokenResponse = await tokenres.json();

    let response = await fetch(
      `https://api.spotify.com/v1/search?type=album&include_external=audio&q=${searchString}`,
      {
        headers: {
          Authorization: 'Bearer ' + tokenResponse.res.access_token,
          'Content-type': 'application/json',
        },
      }
    );

    let data = await response.json();

    if (data.albums) {
      setAlbums(data.albums.items);
    } else {
      setAlbums([]);
    }
  };

  useEffect(() => {
    if (searchString.length > 0) {
      GetData();
    } else {
      {
        setAlbums([]);
      }
    }
  }, [searchString]);

  const handleAlbumSelect = (album) => {
    console.log(album);
    setSelectedAlbum(album);
    setGenerated(false);
  };

  const startGenerating = () => {
    setGenerating(true);

    //convert colors to a list of hex values and set it to hexList
    setHexList(colors);

    setTimeout(() => {
      updateFreeSpotifyUsesRemaining();
      setGenerated(true);
      setGenerating(false);
    }, 2000);
  };

  async function addSpotifyPalette() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from('palettes').insert([
        {
          name: `${selectedAlbum.name} - album palette`,
          colors: hexList,
          user_id: user.id,
          type: 'album_art',
        },
      ]);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        notifyAddPalette();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function notifyAddPalette() {
    toast.success('Added to your library!');
  }

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--image',
      `url('${selectedAlbum.images[0].url}')`
    );
  }, [selectedAlbum]);

  return (
    <div className=" h-screen w-screen relative flex justify-center bg-gray-100 items-center p-4 md:py-32 md:px-32">
      <Toaster position="bottom-right" />

      {session ? (
        <div className="w-full relative h-max  md:h-full overflow-y-scroll bg-white flex flex-col gap-4 md:flex-row justify-center items-center rounded-3xl py-8 md:mt-0 md:pl-12">
          <div className="p-2 bottom-4 h-max md:top-0 md:right-0 md:mr-4 absolute px-4 text-sm bg-green-50 text-green-500 rounded-full mt-4">
            {freeSpotifyUsesRemaining > 0
              ? `You have ${freeSpotifyUsesRemaining} free uses remaining`
              : 'You have no free uses remaining'}
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col mt-12 rounded-3xl border-2 border-black border-opacity-10">
              <div className="flex flex-row gap-2 w-full text-black/40 placeholder-black placeholder-opacity-40 rounded-t-3xl outline-none p-2 md:p-2">
                <div className="opacity-40">
                  <svg
                    width="32px"
                    height="32px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#000"
                  >
                    <path
                      d="M15.5 15.5L19 19M5 11a6 6 0 1012 0 6 6 0 00-12 0z"
                      stroke="#000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <input
                  className="bg-transparent outline-none w-full text-black placeholder-black placeholder-opacity-80"
                  placeholder={`Search for an album`}
                  autoComplete="off"
                  id="search"
                  value={searchString}
                  onChange={(e) => {
                    setSearchString(e.target.value);
                  }}
                />
              </div>
              <div className=" max-w-[300px] w-96 ">
                {albums.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 'auto' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    key={albums}
                    className="border-t-2 border-black border-opacity-10 flex flex-col w-full max-h-36 md:max-h-64 overflow-y-scroll"
                  >
                    {albums.map((album, key) => (
                      <div
                        key={key}
                        onClick={() => {
                          handleAlbumSelect(album);
                        }}
                        className="cursor-pointer group py-2 px-4 flex flex-row max-w-[300px] w-96 items-center hover:bg-opacity-5"
                      >
                        <Image
                          src={album.images[2].url}
                          width={50}
                          height={50}
                          className=" opacity-60 group-hover:opacity-100"
                        />
                        <div className="ml-4 text-sm text-black text-opacity-40 group-hover:text-opacity-80">
                          {album.name}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            <div>
              {selectedAlbum && (
                <div className="bg-gray-50 flex flex-row md:flex-col items-center p-4 rounded-md">
                  <motion.div
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: -20,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.3 }}
                    key={selectedAlbum.name}
                    id="albumPreview"
                    className="z-10  shadow-sm albumImage w-[50px] md:w-[150px] aspect-square"
                  ></motion.div>
                  <div className=" flex flex-col text-center mt-2 h-8 justify-center items-center">
                    <div className="text-black text-opacity-40 w-24 text-sm truncate">
                      {selectedAlbum.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {selectedAlbum && (
              <>
                <ColorExtractor
                  maxColors={10}
                  className="bg-red-500"
                  src={selectedAlbum.images[0].url}
                  getColors={setColors}
                ></ColorExtractor>
              </>
            )}
          </div>
          <div className=" flex justify-center items-center">
            {generated ? (
              <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 md:flex flex-row gap-1 md:gap-4">
                  {colors.map((color) => {
                    return (
                      <div
                        key={color.name}
                        className="group w-16 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-12 h-12 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <div className=" text-transparent group-hover:text-gray-300 transition-all duration-200">
                          {color}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  onClick={() => {
                    addSpotifyPalette();
                    notifyAddPalette();
                  }}
                  className="h-max w-max bg-slate-500/5 text-slate-500 rounded-md p-4 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                >
                  Save Palette
                </div>
              </div>
            ) : (
              <>
                {!generating && (
                  <button
                    disabled={freeSpotifyUsesRemaining === 0 ? true : false}
                    onClick={() => {
                      startGenerating();
                    }}
                    //make button disabled if no free uses remaining
                    className={
                      freeSpotifyUsesRemaining === 0
                        ? `h-max w-max bg-slate-500/5 text-slate-500 rounded-md p-4 cursor-not-allowed`
                        : `h-max w-max bg-slate-500/5 text-slate-500 rounded-md p-4 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200`
                    }
                  >
                    <div className="flex gap-2 w-max">
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
                          d="M12 14.5a6 6 0 100-12 6 6 0 000 12z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M16 21.5a6 6 0 100-12 6 6 0 000 12z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M8 21.5a6 6 0 100-12 6 6 0 000 12z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      Generate Palette
                    </div>
                  </button>
                )}
              </>
            )}
            {generating ? (
              <>
                <div className="blur-[15px] saturate-[200%] mt-8">
                  <div className="loader1 left-1/2 top-1/2 z-10 "></div>
                  <div className="loader2 left-1/2 top-1/2 z-10 "></div>
                  <div className="loader3 left-1/2 top-1/2 z-10 "></div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white flex flex-col justify-center items-center rounded-3xl pt-24 py-8 md:mt-0 md:py-12">
          <div className="mx-auto text-2xl mb-4 font-bold tracking-tight">
            Album Art
          </div>
          <div className="mx-auto text-lg text-center leading-tight">
            Convert your fav album artworks to <br /> radiant color palettes
          </div>
          <div className="relative w-max bg-black">
            <Link
              href={'/login'}
              className="bg-white shadow-sm cta top-1/2 flex items-center justify-center w-64 h-16 text-blue-500 rounded-full z-[20]"
            >
              <div>Choose Album</div>
            </Link>
            <div className="blur-[25px] h-64 saturate-[200%] mt-8">
              <div className="loader1 left-1/2 top-1/2 z-10 "></div>
              <div className="loader2 left-1/2 top-1/2 z-10 "></div>
              <div className="loader3 left-1/2 top-1/2 z-10 "></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumArt;
