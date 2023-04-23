import { motion } from 'framer-motion';
import Color from 'color';
import { useEffect } from 'react';

export default function ExportPalette({ hexList }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
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

  function updateBG(hexList) {
    let root = document.documentElement;
    for (let i = 0; i < 6; i++) {
      root.style.setProperty(`--background${i + 1}-hex`, hexList[i]);
    }
  }

  useEffect(() => {
    updateBG(hexList);
  }, []);

  return (
    <div>
      {hexList && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          key={hexList}
          className="w-80 md:w-96 p-4 gap-1 relative items-center shadow-inner flex  rounded-lg bg-neutral-100/50"
        >
          {hexList.map((hex, index) => {
            return (
              <motion.div
                variants={itemDown}
                key={index}
                style={{ backgroundColor: hex }}
                className="w-8 h-8 rounded-full "
              ></motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
