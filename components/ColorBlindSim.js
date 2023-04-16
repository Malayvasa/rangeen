import Color, { rgb } from 'color';
import { useEffect, useState } from 'react';
import { simulate } from '@bjornlu/colorblind';

export default function ColorBlindSim({ hexColors, type }) {
  const [colorBlindPalette, setColorBlindPalette] = useState([]);

  useEffect(() => {
    //convert all hex colors to rgb in format like { r: 120, g: 50, b: 30 } for colorblindness simulation
    let rgbColors = hexColors.map((color) => {
      let rgb = Color(color).rgb().array();
      return { r: rgb[0], g: rgb[1], b: rgb[2] };
    });

    //simulate color blindness, convert back to hex and store in array
    let palette = rgbColors.map((color) => {
      let simulatedColor = simulate(color, type);
      return Color.rgb(
        simulatedColor.r,
        simulatedColor.g,
        simulatedColor.b
      ).hex();
    });

    //set colorBlindPalette to the new array
    setColorBlindPalette(palette);
  }, [hexColors, type]);

  return (
    <>
      <div className="bg-white relative flex flex-col gap-2 shadow-sm p-4 rounded-md w-max ">
        <div className="text-lg absolute top-1/2 -translate-x-40 bg-neutral-800/10 p-2 rounded-full -translate-y-[50%] left-0 font-bold tracking-tight mb-2 mx-auto capitalize text-neutral-400">
          {type}
        </div>
        <div className="flex  gap-4">
          {colorBlindPalette.map((color) => {
            return (
              <div key={color}>
                <div
                  className="w-10 h-10 md:rounded-full"
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
