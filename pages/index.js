import { useEffect, useState } from 'react';
import Color from 'color';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import album from '../components/assets/album.jpeg';
import Image from 'next/image';
import Head from 'next/head';

import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';

import LogIn from '@/components/LogIn';
import ExportModal from '@/components/ExportModal';
import ColorBlindSim from '@/components/ColorBlindSim';
import Link from 'next/link';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const colorblindTypes = ['protanopia', 'deuteranopia', 'tritanopia'];
  const [randomNewPalette, setRandomNewPalette] = useState([
    '#DF8F7F',
    '#50523F',
    '#9EF453',
    '#61CAD4',
    '#5FA4D3',
    '#1534A3',
    '#9867D5',
    '#CAAAE1',
    '#A924C6',
    '#A3314C',
  ]);

  const colorGPTExamplePalette = [
    '#00aaff',
    '#20c9f5',
    '#4bf3ff',
    '#00ddff',
    '#80f9ff',
    '#3b80e9',
  ];

  const albumArtExamplePalette = [
    '#ea9a45',
    '#efcf79',
    '#612612',
    '#894e0f',
    '#c4aca9',
    '#813217',
  ];

  const [SavePalettes, setSavePalettes] = useState({
    palettes: [
      [
        '#D0D397',
        '#3EC84A',
        '#72E1E2',
        '#65BDE4',
        '#2597DC',
        '#0B5E9B',
        '#E58AD6',
        '#E618A3',
        '#C8B7BF',
        '#BC0C43',
      ],
      [
        '#F1F7E9',
        '#9CAB56',
        '#918491',
        '#4B5F6F',
        '#78AABF',
        '#F6B29C',
        '#F5E1CC',
        '#E7D0A1',
        '#ECDD86',
        '#F5F0E5',
      ],
      [
        '#A7C6DF',
        '#FCDC90',
        '#D67785',
        '#5989B6',
        '#F3D3CE',
        '#A0CECD',
        '#FEA86D',
        '#D57FA9',
        '#6C9DD2',
        '#E5C5AD',
      ],
    ],
  });

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

    //sort the colors according to hue
    randomColors.sort((a, b) => {
      return Color(a).hue() - Color(b).hue();
    });

    setRandomNewPalette(randomColors);
    console.log(SavePalettes);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemUp = {
    hidden: { y: -5, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const itemDown = {
    hidden: { y: 5, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="overflow-x-hidden w-screen flex justify-center bg-gray-100 pt-44 px-4 py-4 md:px-32">
      <Head>
        <title>Rangeen</title>
        <meta name="description" content="Rangeen" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:title" content="Rangeen" />
        <meta property="og:description" content="The tool to create and curate color palettes for your next project" />
        <meta property="og:image" content="https://rangeenpalettes.vercel.app/og.png" />
        <meta property="og:url" content="https://rangeen.vercel.app/" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rangeen" />
        <meta name="twitter:description" content="The tool to create and curate color palettes for your next project" />
        <meta name="twitter:image" content="https://rangeenpalettes.vercel.app/og.png" />
        <meta name="twitter:site" content="@rangeen" />
        <meta name="twitter:creator" content="@rangeen" />
        </Head>
      <div className="flex flex-col w-full">
        <div className="font-black text-5xl md:text-7xl tracking-tighter text-center">
          Start making your world <br /> more{' '}
          <span className="text-[#EDA315]">rangeen</span>
        </div>

        <div className="flex h-max flex-row justify-center items-center gap-4 mt-12">
          <div>
            <svg
              width="111"
              height="32"
              viewBox="0 0 111 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_0_1)">
                <path
                  d="M108.579 10.7943H85.8427V10.1141C85.8427 4.88906 83.4118 2.27612 78.55 2.27612C75.9554 2.27612 74.0776 2.97465 72.9165 4.3717C71.7372 5.75046 71.1476 7.66487 71.1476 10.1141V10.7943H42.7319C41.4611 10.7943 40.4316 11.8238 40.4316 13.0937C40.4316 14.3636 41.4611 15.3931 42.7319 15.3931H48.1337V16.1012C48.1337 17.0444 47.8977 17.77 47.4256 18.2777C46.9544 18.7681 46.0651 19.0129 44.7587 19.0129C43.2858 19.0129 42.0917 20.207 42.0917 21.6798V25.2447C42.0917 26.3691 42.3373 27.3856 42.8268 28.2923C43.3163 29.1815 44.0331 29.8888 44.9764 30.4148C45.938 30.9235 47.0903 31.1769 48.4325 31.1769C50.3016 31.1769 51.7526 30.6509 52.7865 29.5987C53.8395 28.5466 54.3656 27.1225 54.3656 25.3257C54.3656 24.9259 54.0302 24.6185 53.6296 24.6185H49.9297C49.4332 24.6185 49.0317 25.0209 49.0317 25.5165C49.0317 25.7891 48.9681 26.0155 48.8409 26.1967C48.7321 26.3787 48.5596 26.4693 48.3236 26.4693C47.8341 26.4693 47.5893 26.1514 47.5893 25.5165V23.4209C49.8565 23.2946 51.4356 22.5778 52.324 21.2713C53.2315 19.9648 53.6853 18.2412 53.6853 16.1012V15.3931H63.0553V21.0266C63.0553 21.4803 62.9917 21.8522 62.8646 22.1423C62.7557 22.414 62.5292 22.5508 62.1843 22.5508C61.8394 22.5508 61.5947 22.4236 61.4492 22.1693C61.3221 21.8975 61.2594 21.516 61.2594 21.0266C61.2594 20.5371 60.8692 20.1556 60.3884 20.1556H56.7965C56.2878 20.1556 55.8706 20.5449 55.8706 21.0536C55.8706 23.1038 56.4333 24.6551 57.5577 25.7072C58.7013 26.7411 60.2978 27.2584 62.3472 27.2584C64.3966 27.2584 65.994 26.6688 67.0279 25.4895C68.08 24.3101 68.6069 22.7406 68.6069 20.7818V15.3931H71.1371V29.604C71.1371 30.3373 71.732 30.9322 72.4654 30.9322H75.3614C76.0947 30.9322 76.6888 30.3373 76.6888 29.604V15.3931H80.2911V29.604C80.2911 30.3373 80.886 30.9322 81.6194 30.9322H84.5145C85.2487 30.9322 85.8427 30.3373 85.8427 29.604V15.3931H103.231V17.5705H95.6656C94.3957 17.5705 93.2347 17.797 92.1826 18.2507C91.1305 18.6862 90.2865 19.3665 89.6515 20.2915C89.0349 21.2173 88.7265 22.36 88.7265 23.7205C88.7265 24.9904 89.0262 26.0974 89.6245 27.0407C90.2412 27.9656 91.0399 28.6738 92.0197 29.1632C93.017 29.6353 94.0787 29.8705 95.2031 29.8705C96.3276 29.8705 97.29 29.671 98.1967 29.2721C99.1043 28.8732 99.8298 28.274 100.374 27.4762C100.918 26.6601 101.19 25.6619 101.19 24.4826C101.19 23.6299 101.045 22.8591 100.755 22.1693H103.231V29.604C103.231 30.3373 103.826 30.9322 104.559 30.9322H107.455C108.189 30.9322 108.783 30.3373 108.783 29.604V15.3931C109.94 15.3931 110.878 14.455 110.878 13.2975V13.0937C110.878 11.8238 109.849 10.7943 108.579 10.7943ZM80.4549 10.7943H76.5355V9.84145C76.5355 9.04363 76.6626 8.36339 76.9169 7.80074C77.1704 7.2198 77.7148 6.92976 78.55 6.92976C79.3296 6.92976 79.8382 7.2198 80.0734 7.80074C80.3277 8.36339 80.4549 9.04363 80.4549 9.84145V10.7943ZM96.3737 24.8092C96.1011 25.081 95.7388 25.2177 95.285 25.2177C94.8312 25.2177 94.4323 25.081 94.1423 24.8092C93.8514 24.5192 93.7068 24.1473 93.7068 23.6935C93.7068 23.2397 93.8514 22.8948 94.1423 22.6048C94.4506 22.3147 94.8312 22.1693 95.285 22.1693C95.7388 22.1693 96.1011 22.3147 96.3737 22.6048C96.6638 22.8948 96.8084 23.258 96.8084 23.6935C96.8084 24.129 96.6638 24.5192 96.3737 24.8092Z"
                  fill="black"
                />
                <path
                  d="M50.5526 0.758906C50.9132 0.550742 51.3574 0.550742 51.718 0.758906L54.0122 2.08367C54.3727 2.29183 54.5948 2.6768 54.5948 3.09313V5.74265C54.5948 6.15898 54.3727 6.54395 54.0122 6.75211L51.718 8.07687C51.3574 8.28503 50.9132 8.28503 50.5526 8.07687L48.2585 6.75211C47.8979 6.54395 47.6758 6.15898 47.6758 5.74265V3.09313C47.6758 2.6768 47.8979 2.29183 48.2585 2.08367L50.5526 0.758906Z"
                  fill="black"
                />
              </g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M23.9806 6.92842C23.1796 5.54113 21.6994 4.68652 20.0975 4.68652H9.9019C8.29999 4.68652 6.81977 5.54113 6.01881 6.92842L0.921028 15.758C0.120074 17.1453 0.120074 18.8546 0.921027 20.2418L6.01881 29.0715C6.81977 30.4588 8.29999 31.3134 9.9019 31.3134L20.0975 31.3134C21.6994 31.3134 23.1796 30.4588 23.9806 29.0715L29.0783 20.2418C29.8793 18.8546 29.8793 17.1453 29.0783 15.758L23.9806 6.92842ZM19.6935 13.4769C19.6935 16.2092 17.4785 18.4243 14.7462 18.4243C12.0138 18.4243 9.79883 16.2092 9.79883 13.4769C9.79883 10.7445 12.0138 8.52954 14.7462 8.52954C17.4785 8.52954 19.6935 10.7445 19.6935 13.4769ZM9.97608 19.8249C9.66598 19.2487 10.2934 18.6213 10.8696 18.9314L18.5203 23.0494C18.9095 23.2588 18.9866 23.7842 18.6741 24.0967L15.1414 27.6294C14.8289 27.9419 14.3035 27.8648 14.0941 27.4756L9.97608 19.8249Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="mt-[12px]">| rangeen |</div>
          <div className="flex flex-col">
            <div className="text-sm">adjective</div>
            <div className="font-semibold">1. colorful</div>
            <div className="font-semibold">2. jovial</div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-[1050px] mx-auto md:px-24 items-center shadow-sm rounded-3xl my-20 py-16 px-8 gap-12 bg-white justify-center">
          {randomNewPalette && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              key={randomNewPalette}
              className=" grid grid-cols-5 md:flex flex-wrap items-center md:w-full mx-auto justify-center gap-6 "
            >
              {randomNewPalette.map((color, index) => {
                return (
                  <motion.div
                    //change fade in direction based on the index of the color
                    variants={index % 2 === 0 ? itemUp : itemDown}
                    //make the hexagons draggable
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.5}
                    dragMomentum={false}
                    key={color}
                    //rotate the hexagons with a random angle
                    style={{
                      rotate: Math.floor(Math.random() * 360),
                    }}
                    className="
                    w-[50px] h-[50px]
                    aspect-w-1 aspect-h-1
                    md:w-[60px] md:h-[60px]
                    
                    "
                  >
<svg  viewBox="0 0 288 288" fill={color} xmlns="http://www.w3.org/2000/svg">
<path d="M123.5 11.8357C136.185 4.51174 151.815 4.51174 164.5 11.8357L248.208 60.1643C260.893 67.4883 268.708 81.0235 268.708 95.6714V192.329C268.708 206.977 260.893 220.512 248.208 227.836L164.5 276.164C151.815 283.488 136.185 283.488 123.5 276.164L39.7923 227.836C27.1069 220.512 19.2923 206.977 19.2923 192.329V95.6714C19.2923 81.0235 27.1069 67.4883 39.7923 60.1643L123.5 11.8357Z" fill={color}/>
</svg>


                  </motion.div>
                );
              })}
            </motion.div>
          )}
          <div className="flex flex-row justify-center items-center space-x-4">
            <div>
              <button
                className="bg-slate-800 w-max flex text-slate-300 rounded-full py-[10px] gap-2 px-[10px] md:px-[20px] hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
                onClick={() => {
                  generateRandomColors();
                }}
              >
                Randomize
                <svg
                  width="22px"
                  height="22px"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                >
                  <path
                    d="M22 7c-3 0-8.5 0-10.5 5.5S5 18 2 18"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M20 5l2 2-2 2M22 18c-3 0-8.5 0-10.5-5.5S5 7 2 7"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M20 20l2-2-2-2"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
            <ExportModal hexList={randomNewPalette}>
              <button className="bg-slate-200/20 w-max shadow-sm flex text-slate-500 rounded-full py-[10px] gap-2 px-[20px] hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
                Download
                <svg
                  width="22px"
                  height="22px"
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
              </button>
            </ExportModal>
          </div>
        </div>

        <div className="font-black text-5xl md:text-7xl mt-[80px] tracking-tighter text-center">
          Palettes as easy <br /> as #<span className="text-[#6d61ff]">11</span>
          <span className="text-[#EDA315]">22</span>
          <span className="text-[#ec3d3d]">33</span>
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-[950px] h-max mx-auto gap-8 mt-12">
          <div className="flex flex-col w-full h-max items-center">
            <div className="flex w-full justify-center items-center rounded-t-3xl pt-6 pb-8 gap-8">
              <svg
                height="60"
                viewBox="0 0 69 73"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.2554 3.08835C30.9979 -0.227039 38.0728 -0.22704 43.8152 3.08834L58.8611 11.7751C64.6035 15.0905 68.141 21.2175 68.141 27.8483V45.2218C68.141 51.8526 64.6035 57.9796 58.8611 61.295L43.8152 69.9818C38.0728 73.2971 30.9979 73.2971 25.2554 69.9818L10.2096 61.295C4.46716 57.9796 0.929688 51.8526 0.929688 45.2218V27.8483C0.929687 21.2175 4.46716 15.0905 10.2096 11.7751L25.2554 3.08835Z"
                  fill="#72FFD5"
                />
                <path
                  d="M22 50.183L36.3068 35.8763M43.4601 28.7229L39.8834 32.2996"
                  stroke="#1D785D"
                  stroke-width="2.14601"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M31.2994 23L32.6513 26.6554L36.3067 28.0074L32.6513 29.3594L31.2994 33.0147L29.9474 29.3594L26.292 28.0074L29.9474 26.6554L31.2994 23ZM44.8908 34.4454L45.6633 36.5342L47.7521 37.3068L45.6633 38.0793L44.8908 40.1681L44.1182 38.0793L42.0294 37.3068L44.1182 36.5342L44.8908 34.4454Z"
                  stroke="#1D785D"
                  stroke-width="2.14601"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="font-semibold text-2xl">Prompt to Palette</div>
            </div>
            <div className="bg-white shadow-lg flex flex-col items-center w-full  max-w-[450px] p-4 pt-6 md:p-8 rounded-3xl">
              <div className="w-max">
                <div className="flex gap-x-4 items-center border-[2px] rounded-full">
                  <input
                    value={'ghibli ocean'}
                    placeholder="What's your mood?"
                    className="p-4 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50"
                  ></input>
                  <button
                    // disabled button greyed out if no uses remaining
                    className={`text-blue-500 p-2 rounded-full focus:outline-none  focus:text-blue-500 focus:placeholder-white/50`}
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
              </div>
              <div className="blur-[15px] relative w-[150px] h-[150px] saturate-[200%] my-16">
                <div className="loader1 left-1/2 top-1/2 z-10 "></div>
                <div className="loader2 left-1/2 top-1/2 z-10 "></div>
                <div className="loader3 left-1/2 top-1/2 z-10 "></div>
              </div>
              <div>
                {colorGPTExamplePalette && (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key={colorGPTExamplePalette}
                    className="bg-gray-100 p-4 rounded-md flex items-center md:w-full mx-auto justify-center gap-4 "
                  >
                    {colorGPTExamplePalette.map((color, index) => {
                      return (
                        <motion.div
                          //change fade in direction based on the index of the color
                          variants={index % 2 === 0 ? itemUp : itemDown}
                          //make the hexagons draggable
                          drag
                          dragConstraints={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                          }}
                          dragElastic={0.5}
                          dragMomentum={false}
                          key={color}
                          //rotate the hexagons with a random angle
                          style={{
                            rotate: Math.floor(Math.random() * 360),
                          }}
                          className=""
                        >
                          <div
                            className="w-[30px] h-[30px] rounded-full"
                            style={{
                              backgroundColor: color,
                            }}
                          ></div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-col h-full justify-end w-full items-center">
              <div className="flex w-3/4  justify-center items-center rounded-t-3xl pt-6 pb-8 gap-8">
                <svg
                  height="60"
                  viewBox="0 0 69 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.2554 2.48654C30.9979 -0.828845 38.0728 -0.828847 43.8152 2.48654L58.8611 11.1733C64.6035 14.4887 68.141 20.6157 68.141 27.2465V44.62C68.141 51.2507 64.6035 57.3778 58.8611 60.6932L43.8152 69.38C38.0728 72.6953 30.9979 72.6953 25.2554 69.38L10.2096 60.6932C4.46716 57.3778 0.929688 51.2507 0.929688 44.62V27.2465C0.929687 20.6157 4.46716 14.4887 10.2096 11.1733L25.2554 2.48654Z"
                    fill="#EDA315"
                  />
                  <path
                    d="M33.1574 38.7895C35.2512 38.7895 37.2593 37.9577 38.7399 36.4772C40.2204 34.9966 41.0522 32.9886 41.0522 30.8947C41.0522 28.8009 40.2204 26.7929 38.7399 25.3123C37.2593 23.8318 35.2512 23 33.1574 23C31.0636 23 29.0556 23.8318 27.575 25.3123C26.0945 26.7929 25.2627 28.8009 25.2627 30.8947C25.2627 32.9886 26.0945 34.9966 27.575 36.4772C29.0556 37.9577 31.0636 38.7895 33.1574 38.7895Z"
                    stroke="#69490B"
                    stroke-width="1.97368"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M38.4211 47.9999C39.4579 47.9999 40.4845 47.7957 41.4423 47.399C42.4001 47.0022 43.2704 46.4207 44.0035 45.6876C44.7366 44.9545 45.3181 44.0842 45.7149 43.1264C46.1116 42.1685 46.3158 41.1419 46.3158 40.1052C46.3158 39.0684 46.1116 38.0418 45.7149 37.084C45.3181 36.1262 44.7366 35.2559 44.0035 34.5228C43.2704 33.7897 42.4001 33.2081 41.4423 32.8114C40.4845 32.4147 39.4579 32.2104 38.4211 32.2104C36.3273 32.2104 34.3192 33.0422 32.8387 34.5228C31.3581 36.0033 30.5264 38.0114 30.5264 40.1052C30.5264 42.199 31.3581 44.2071 32.8387 45.6876C34.3192 47.1682 36.3273 47.9999 38.4211 47.9999Z"
                    stroke="#69490B"
                    stroke-width="1.97368"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M27.8947 47.9999C28.9315 47.9999 29.9581 47.7957 30.9159 47.399C31.8738 47.0022 32.7441 46.4207 33.4772 45.6876C34.2103 44.9545 34.7918 44.0842 35.1885 43.1264C35.5853 42.1685 35.7895 41.1419 35.7895 40.1052C35.7895 39.0684 35.5853 38.0418 35.1885 37.084C34.7918 36.1262 34.2103 35.2559 33.4772 34.5228C32.7441 33.7897 31.8738 33.2081 30.9159 32.8114C29.9581 32.4147 28.9315 32.2104 27.8947 32.2104C25.8009 32.2104 23.7929 33.0422 22.3123 34.5228C20.8318 36.0033 20 38.0114 20 40.1052C20 42.199 20.8318 44.2071 22.3123 45.6876C23.7929 47.1682 25.8009 47.9999 27.8947 47.9999Z"
                    stroke="#69490B"
                    stroke-width="1.97368"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div className="font-semibold text-2xl">
                  Album Art to Palette
                </div>
              </div>
              <div className="bg-white flex-grow shadow-lg flex flex-col w-full max-w-[450px] items-center p-4 pt-8 md:p-8 rounded-3xl">
                <div
                  className="
                w-[300px] h-[300px] bg-gray-100 rounded-md flex items-center justify-center mb-8
                "
                >
                  <Image src={album} />
                </div>
                <div>
                  {albumArtExamplePalette && (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      key={albumArtExamplePalette}
                      className="bg-gray-100 p-4 rounded-md flex items-center md:w-full mx-auto justify-center gap-4 "
                    >
                      {albumArtExamplePalette.map((color, index) => {
                        return (
                          <motion.div
                            //change fade in direction based on the index of the color
                            variants={index % 2 === 0 ? itemUp : itemDown}
                            //make the hexagons draggable
                            drag
                            dragConstraints={{
                              left: 0,
                              right: 0,
                              top: 0,
                              bottom: 0,
                            }}
                            dragElastic={0.5}
                            dragMomentum={false}
                            key={color}
                            //rotate the hexagons with a random angle
                            style={{
                              rotate: Math.floor(Math.random() * 360),
                            }}
                            className=""
                          >
                            <div
                              className="w-[30px] h-[30px] rounded-full"
                              style={{
                                backgroundColor: color,
                              }}
                            ></div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white relative w-full max-w-[1050px] rounded-3xl mt-24 mb-12 md:my-44 md:pb-24 py-8 md:px-12 mx-auto">
          <div className="flex flex-col md:flex-row gap-8 relative overflow-x-hidden overflow-y-hidden">
            <div className="flex flex-col  ">
              <div className="font-black text-5xl md:text-6xl tracking-tighter text-center md:text-left">
                Easily <span className="text-[#EC3D3D]">save</span>, <br />
                <span className="text-[#1ECDD6]">view</span> and <br />
                <span className="text-[#7A36A5]">export</span> your <br />{' '}
                palettes.
              </div>
            </div>

            <div className="flex flex-col gap-4 mx-4 md:mx-0">
              {SavePalettes.palettes.map((palette, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-md grid grid-cols-5 md:flex items-center justify-center gap-4 "
                  >
                    {palette.map((color, index) => {
                      return (
                        <motion.div key={index}>
                          <div
                            className="w-10 h-10 rounded-full"
                            style={{
                              backgroundColor: color,
                            }}
                          ></div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-50 md:absolute z-[10] md:bottom-0 md:right-0 scale-75 md:scale-[90%] md:translate-y-[35%] md:-translate-x-[10%] mx-auto flex items-center justify-center p-8 w-max rounded-3xl shadow-lg">
            <div className="flex flex-col gap-y-4">
              <div className="w-72 md:w-96 p-4 gap-2 relative items-center shadow-sm flex text-gray-600 rounded-lg bg-white">
                <div>
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
                      d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                SVG Palette
                <div className="flex items-center gap-1 absolute mr-4 right-0 bg-amber-50 text-amber-400 text-center p-1 rounded-md text-xs w-max">
                  <div>
                    <svg
                      width="22px"
                      height="22px"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="currentColor"
                    >
                      <g
                        clip-path="url(#bright-star_svg__clip0_3057_14628)"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M9.952 9.623l1.559-3.305a.535.535 0 01.978 0l1.559 3.305 3.485.533c.447.068.625.644.302.974l-2.522 2.57.595 3.631c.077.467-.391.822-.791.602L12 16.218l-3.117 1.715c-.4.22-.868-.135-.791-.602l.595-3.63-2.522-2.571c-.323-.33-.145-.906.302-.974l3.485-.533zM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1"></path>
                      </g>
                      <defs>
                        <clipPath id="bright-star_svg__clip0_3057_14628">
                          <path fill="#fff" d="M0 0h24v24H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  Recommended
                </div>
              </div>
              <div className="w-72 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white">
                <div>
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
                      d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                HEX Palette
              </div>
              <div className="w-72 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white">
                <div>
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
                      d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                RGB Palette
              </div>
              <div className="w-72 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white">
                <div>
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
                      d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                CMYK Palette
              </div>
            </div>
          </div>
        </div>

        <div className="font-black text-5xl md:text-7xl mt-28 tracking-tighter text-center">
          Design your colors with <br />{' '}
          <span className="text-[#6d61ff]">accessibility</span> in mind
        </div>

        <div className="flex flex-col mb-44 mx-auto mt-16 gap-4">
          <div className="bg-white relative flex flex-col gap-2 shadow-sm p-4 rounded-md w-max ">
            <div className="text-lg md:absolute md:top-1/2 md:-translate-x-40 bg-neutral-800/5 p-2 rounded-full md:-translate-y-[50%] left-0 font-semibold tracking-tight mb-2 mx-auto capitalize text-neutral-500">
              Typical Vision
            </div>
            <div className="flex  md:gap-4">
              {randomNewPalette.map((color) => {
                return (
                  <div key={color}>
                    <div
                      className="w-8 md:w-10 h-8 md:h-10 md:rounded-full"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          {colorblindTypes.map((type) => {
            return (
              <ColorBlindSim
                key={type}
                type={type}
                hexColors={randomNewPalette}
              />
            );
          })}
        </div>

        <div className="font-black text-5xl md:text-7xl my-16 md:my-32 tracking-tighter text-center">
          A lot more is <br /> coming{' '}
          <span className="text-[#45C746]">your</span> way
        </div>

        <div className="flex flex-col gap-4 mb-4 md:flex-row md:mb-16 md:h-32 md:w-2/3 max-w-[800px] mx-auto relative">
          <div className="w-[250px] md:w-[500px] justify-between flex items-center gap-4 text-[#E72DAD] bg-white rounded-full md:text-2xl p-8 md:absolute md:left-0 md:-translate-y-[100%]">
            Polar Coordinate Based Palettes
            <svg
              width="32"
              viewBox="0 0 68 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.3258 2.48654C30.0682 -0.828845 37.1431 -0.828847 42.8855 2.48654L57.9314 11.1733C63.6738 14.4887 67.2113 20.6157 67.2113 27.2465V44.62C67.2113 51.2507 63.6738 57.3778 57.9314 60.6932L42.8855 69.38C37.1431 72.6953 30.0682 72.6953 24.3258 69.38L9.27989 60.6932C3.53747 57.3778 0 51.2507 0 44.62V27.2465C0 20.6157 3.53747 14.4887 9.27989 11.1733L24.3258 2.48654Z"
                fill="#E72DAD"
              />
            </svg>
          </div>
          <div className="w-[250px] md:w-[500px] justify-between flex items-center gap-4 text-[#4114DF] bg-white rounded-full md:text-2xl p-8 md:absolute md:right-0 md:translate-y-[40%] md:translate-x-[10%]">
            Figma Plugin
            <svg
              width="32"
              viewBox="0 0 68 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.3258 2.48654C30.0682 -0.828845 37.1431 -0.828847 42.8855 2.48654L57.9314 11.1733C63.6738 14.4887 67.2113 20.6157 67.2113 27.2465V44.62C67.2113 51.2507 63.6738 57.3778 57.9314 60.6932L42.8855 69.38C37.1431 72.6953 30.0682 72.6953 24.3258 69.38L9.27989 60.6932C3.53747 57.3778 0 51.2507 0 44.62V27.2465C0 20.6157 3.53747 14.4887 9.27989 11.1733L24.3258 2.48654Z"
                fill="#4114DF"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:h-32 md:w-2/3 md:mt-16 max-w-[800px] mx-auto relative">
          <div className="flex items-center gap-4 w-[250px] md:w-[500px] justify-between bg-white text-[#F2BB54] rounded-full md:text-2xl p-8 md:absolute md:left-0 md:-translate-y-[100%] md:-translate-x-[15%]">
            Curated Palettes
            <svg
              width="32"
              viewBox="0 0 68 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.3258 2.48654C30.0682 -0.828845 37.1431 -0.828847 42.8855 2.48654L57.9314 11.1733C63.6738 14.4887 67.2113 20.6157 67.2113 27.2465V44.62C67.2113 51.2507 63.6738 57.3778 57.9314 60.6932L42.8855 69.38C37.1431 72.6953 30.0682 72.6953 24.3258 69.38L9.27989 60.6932C3.53747 57.3778 0 51.2507 0 44.62V27.2465C0 20.6157 3.53747 14.4887 9.27989 11.1733L24.3258 2.48654Z"
                fill="#F2BB54"
              />
            </svg>
          </div>
          <div className="flex items-center gap-4 w-[250px] md:w-[500px] justify-between bg-white text-[#45C746] rounded-full md:text-2xl p-8 md:absolute md:left-0 md:translate-y-[40%] md:translate-x-[60%]">
            Palette Visualizations
            <svg
              width="32"
              viewBox="0 0 68 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.3258 2.48654C30.0682 -0.828845 37.1431 -0.828847 42.8855 2.48654L57.9314 11.1733C63.6738 14.4887 67.2113 20.6157 67.2113 27.2465V44.62C67.2113 51.2507 63.6738 57.3778 57.9314 60.6932L42.8855 69.38C37.1431 72.6953 30.0682 72.6953 24.3258 69.38L9.27989 60.6932C3.53747 57.3778 0 51.2507 0 44.62V27.2465C0 20.6157 3.53747 14.4887 9.27989 11.1733L24.3258 2.48654Z"
                fill="#45C746"
              />
            </svg>
          </div>
        </div>

        <div className="w-full mt-64"></div>

        <div>
          <div className="w-full h-[600px] relative">
            <div className="blur-[80px] relative md:blur-[80px] z-10  saturate-[200%] ">
              <div className="herocircle1 left-1/2  z-10 "></div>
              <div className="herocircle2 left-1/2 z-10 "></div>
              <div className="herocircle3 left-1/2  z-10 "></div>
            </div>

            <div className="font-black text-center text-5xl md:text-7xl absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[150%] mx-auto text-white z-[20]">
              Get Started <br /> with rangeen.
            </div>

            <div>
              <Link href="/login">
                <button className="bg-slate-800 mix-blend-overlay text-3xl font-semibold w-max flex absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] md:-translate-y-[0%] text-slate-300 rounded-full py-[30px] gap-2 px-[40px] hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 z-[20]">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
