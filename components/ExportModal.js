import Modal from 'react-modal';
import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Color from 'color';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ExportPalette from './ExportPalette';
import { usePostHog } from 'posthog-js/react';

export default function ExportModal({ hexList, children }) {
  let subtitle;
  let [isOpen, setIsOpen] = useState(false);
  const posthog = usePostHog();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  //function to copy the palette to clipboard
  function copyToClipboard(list) {
    const el = document.createElement('textarea');
    const palette = list;
    const newhexList = palette.join('\n');
    el.value = newhexList;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    posthog.capture('Palette Exported', {
      property: list,
    });
  }

  function copyHexList(hexList) {
    copyToClipboard(hexList);
    toast.success('HEX Copied to clipboard!');
  }

  function copyRGBList(hexList) {
    const rgbList = [];
    hexList.forEach((hex) => {
      const rgb = Color(hex).rgb().array();
      rgbList.push(rgb);
    });
    copyToClipboard(rgbList);
    toast.success('RGB Copied to clipboard!');
  }

  function copySVG(hexList) {
    // convert hexlist to a svg with a row of squares with hex as background color
    // make as many squares as there are colors in the palette
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="${hexList.length * 100}" 
    height="100" viewBox="0 0 ${hexList.length * 100} 100">
    ${hexList
      .map(
        (hex, index) =>
          `<rect width="100" height="100" fill="${hex}" x="${
            index * 100
          }" y="0" />`
      )
      .join('')}
    </svg>`;

    // copy svg to clipboard
    const el = document.createElement('textarea');
    el.value = svg;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast.success('SVG Copied to clipboard!');
  }

  function copyCMYKList(hexList) {
    const cmykList = [];
    hexList.forEach((hex) => {
      const cmyk = Color(hex).cmyk().array();
      //truncate the cmyk values to 2 decimal places using a loop
      for (let i = 0; i < cmyk.length; i++) {
        cmyk[i] = cmyk[i].toFixed(2);
      }
      cmykList.push(cmyk);
    });

    copyToClipboard(cmykList);
    toast.success('CMYK Copied to clipboard!');
  }

  return (
    <>
      <div
        onClick={() => {
          openModal();
        }}
      >
        {children}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed top-1/2 left-1/2">
              <div className="z-[12] circle0 noise3 w-screen h-screen mix-blend-screen opacity-80"></div>
              <div className="blur-[80px] md:blur-[120px] fixed z-[11]  saturate-[200%] ">
                <div className="circle1 left-1/2 top-1/2 z-[11] "></div>
                <div className="circle2 left-1/2 top-1/2 z-10 "></div>
                <div className="circle3 left-1/2 top-1/2 z-10 "></div>
              </div>
            </div>
          </Transition.Child>

          <div className="fixed inset-0 z-20 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-max transform flex flex-col items-center overflow-hidden rounded-2xl bg-neutral-50 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all">
                  <ExportPalette hexList={hexList} />
                  <div className="flex flex-col gap-4 py-4">
                    <button
                      onClick={() => {
                        copySVG(hexList);
                        closeModal();
                      }}
                      className="w-80 md:w-96 p-4 gap-2 relative items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
                    >
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
                    </button>
                    <button
                      onClick={() => {
                        copyHexList(hexList);
                        closeModal();
                      }}
                      className="w-80 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
                    >
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
                    </button>
                    <button
                      onClick={() => {
                        copyRGBList(hexList);
                        closeModal();
                      }}
                      className="w-80 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
                    >
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
                    </button>
                    <button
                      onClick={() => {
                        copyCMYKList(hexList);
                        closeModal();
                      }}
                      className="w-80 md:w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
                    >
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
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
