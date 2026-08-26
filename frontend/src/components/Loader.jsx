import React from 'react';

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 select-none">
      {/* Pulse and bounce container */}
      <div className="airbnb-loader-container flex flex-col items-center space-y-4">
        {/* Animated Airbnb Path Drawing SVG */}
        <svg
          className="h-16 w-16 text-brand"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="airbnb-loader-svg"
            d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.91 3.759 0 4.103-3.51 7.439-7.9 7.439-2.716 0-3.995-1.036-5.214-3.152l-.121-.213c-.615-1.077-1.245-2.138-1.879-3.2l-.777 1.321c-1.22 2.052-2.518 3.244-5.263 3.244-4.39 0-7.9-3.336-7.9-7.439 0-1.287.243-2.168.91-3.759l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.398 0-2.457.653-3.645 2.769l-.533 1.025C9.897 10.569 5.753 19.248 4.79 21.492l-.145.353c-.567 1.353-.745 2.029-.745 2.914 0 3.013 2.54 5.439 5.9 5.439 1.83 0 2.805-.79 3.812-2.483l.206-.353.777-1.321c.548.928 1.096 1.857 1.644 2.785l.121.213c1.02 1.767 1.996 2.559 3.84 2.559 3.36 0 5.9-2.426 5.9-5.439 0-.885-.178-1.561-.745-2.914l-.145-.353c-.963-2.244-5.107-10.923-7.065-14.728l-.533-1.025C18.457 3.653 17.398 3 16 3zm0 9c2.21 0 4 1.79 4 4 0 1.9-1.32 3.5-3.1 3.9l-.15.03c-.25.045-.5.07-.75.07-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4zm0 2c-1.105 0-2 .895-2 2s.895 2 2 2c.441 0 .848-.143 1.18-.387l.088-.072c.46-.421.732-1.02.732-1.541 0-1.105-.895-2-2-2z"
          />
        </svg>
        <span className="text-xs tracking-widest text-[#2D4030] uppercase font-semibold animate-pulse">
          Loading Stays...
        </span>
      </div>
    </div>
  );
}

export default Loader;
