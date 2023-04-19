import { useState } from 'react';
import Modal from 'react-modal';
import Color from 'color';
import toast, { Toaster } from 'react-hot-toast';
import motion, { AnimatePresence } from 'framer-motion';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgb(243 244 246)',
    border: 'none',
    filter: 'drop-shadow(0 2px 0.05rem #00000050)',
    borderRadius: '1.5rem',
    zIndex: '1000',
  },
};

export default function ExportModal({ hexList, children }) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() { }

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
            `<rect width="100" height="100" fill="${hex}" x="${index * 100
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
    <div>
      <Toaster position="bottom-center" />
      <div
        onClick={() => {
          openModal();
        }}
      >
        {children}
      </div>
      <div className="bg-gray-50">
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Export Palette"
        >
          <div className="flex flex-col gap-4">
            <div
              onClick={() => {
                copySVG(hexList);
                closeModal();
              }}
              className="w-96 p-4 gap-2 relative items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
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
            </div>
            <div
              onClick={() => {
                copyHexList(hexList);
                closeModal();
              }}
              className="w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
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
            </div>
            <div
              onClick={() => {
                copyRGBList(hexList);
                closeModal();
              }}
              className="w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
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
            </div>
            <div
              onClick={() => {
                copyCMYKList(hexList);
                closeModal();
              }}
              className="w-96 p-4 gap-2 items-center shadow-sm flex text-gray-600 rounded-lg bg-white"
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
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
