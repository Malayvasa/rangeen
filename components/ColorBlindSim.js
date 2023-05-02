import Color, { rgb } from 'color';
import { useEffect, useState } from 'react';
import { simulate } from '@bjornlu/colorblind';
import axios from 'axios';

export default function ColorBlindSim({ hexColors, type }) {
  const [colorBlindPalette, setColorBlindPalette] = useState([]);

  async function simulateColors(hexColors, type) {
    try {
      //convert array to string
      let hexList = hexColors.join(',');
      const { data } = await axios.get('/api/simulate', {
        params: {
          hexList: hexList,
          type: type,
        },
      });
      return data.simulatedHexList;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getSimulatedColors() {
      const simulatedColors = await simulateColors(hexColors, type);
      setColorBlindPalette(simulatedColors);
    }
    getSimulatedColors();
  }, [hexColors, type]);

  return (
    <>
      <div className="bg-white relative  flex flex-col gap-2 shadow-sm p-4 rounded-md w-full md:w-max ">
        <div className="text-lg md:absolute md:top-1/2 md:-translate-x-40 bg-neutral-800/5 p-2 rounded-full md:-translate-y-[50%] left-0 font-semibold tracking-tight mb-2 mx-auto capitalize text-neutral-500">
          {type}
        </div>
        <div className="flex w-full justify-between md:gap-4">
          {colorBlindPalette.length > 0 &&
            colorBlindPalette.map((color) => {
              return (
                <div key={color}>
                  <div
                    className="w-8 md:w-10 h-8 md:h-10 rounded-full"
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
