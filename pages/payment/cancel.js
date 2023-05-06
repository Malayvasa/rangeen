import Link from 'next/link';

const Cancel = () => {
  return (
    <div className="w-full h-screen md:w-[600px] items-center p-32 justify-center px-8 overflow-hidden flex flex-col m-auto">
      <div
        initial={{ y: 0, opacity: 0, rotate: 270 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 2, type: 'spring', type: 'tween' }}
        className="blur-[80px] md:blur-[120px] fixed z-10 top-1/2 left-1/2 saturate-[200%] "
      >
        <div className="constantcircle1 left-1/2 top-1/2 z-10 "></div>
        <div className="constantcircle2 left-1/2 top-1/2 z-10 "></div>
        <div className="constantcircle3 left-1/2 top-1/2 z-10 "></div>
      </div>
      <p className="z-20 font-bold text-4xl md:text-6xl text-center text-white">
        Uh Oh! <br />
        Payment Cancelled
      </p>
      <Link
        href={'/pricing'}
        className="mt-4 z-20 bg-white text-blue-500 rounded-lg px-4 py-2"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Cancel;
