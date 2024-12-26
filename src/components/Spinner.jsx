import React from 'react';

// SpinnerWrapper component stays the same
const SpinnerWrapper = ({ children, label, className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    {children}
    {label && (
      <div className="text-sm font-medium text-gray-600 animate-pulse">
        {label}
      </div>
    )}
  </div>
);

const Drummer = ({ speed = 800, color = '#ef4444' }) => {
  const stickAnimation = {
    animation: `drumstick ${speed}ms ease-in-out infinite alternate`,
  };

  return (
    <div
      aria-label="Loading"
      role="status"
      className="flex flex-col items-center justify-center p-4 space-y-2"
    >
      <div className="sr-only">Loading Drummer...</div>
      <div className="relative flex items-end justify-center space-x-4">
        <div
          style={{ ...stickAnimation, backgroundColor: color }}
          className="w-2 h-8 rounded-t-md transform origin-bottom animate-pulse"
        />
        <div
          style={{ ...stickAnimation, backgroundColor: color }}
          className="w-2 h-8 rounded-t-md transform origin-bottom animate-pulse"
        />
      </div>
      <div className="flex space-x-4 mt-2">
        <div className="w-6 h-6 rounded-full bg-gray-300" />
        <div className="w-8 h-8 rounded-full bg-gray-400" />
        <div className="w-6 h-6 rounded-full bg-gray-300" />
      </div>
      <style jsx>{`
        @keyframes drumstick {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-45deg); }
        }
      `}</style>
    </div>
  );
};

const BrickLayer = ({ speed = 600, color = '#f59e0b' }) => {
  const brickAnimation = {
    animation: `placeBrick ${speed}ms linear infinite`,
  };

  return (
    <div
      aria-label="Loading"
      role="status"
      className="flex flex-col items-center justify-center p-4 space-y-2"
    >
      <div className="sr-only">Loading Brick Layer...</div>
      <div className="flex flex-wrap w-32 h-16 bg-transparent relative overflow-hidden border-2 border-gray-200">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-1/3 h-1/2 flex items-center justify-center">
            <div
              style={{ ...brickAnimation, backgroundColor: color }}
              className="w-5 h-3"
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes placeBrick {
          0% { transform: translateY(50px); opacity: 0; }
          50% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const Gardener = ({ speed = 1200, color = '#10b981' }) => {
  const plantAnimation = {
    animation: `growPlant ${speed}ms ease-in-out infinite alternate`,
    backgroundColor: color,
  };

  return (
    <div
      aria-label="Loading"
      role="status"
      className="flex flex-col items-center justify-center p-4"
    >
      <div className="sr-only">Loading Gardener...</div>
      <div className="relative w-16 h-16 flex items-end justify-center">
        <div className="absolute bottom-0 w-full h-2 bg-gray-400" />
        <div
          style={plantAnimation}
          className="w-4 h-4 rounded-full mb-0 animate-pulse"
        />
      </div>
      <style jsx>{`
        @keyframes growPlant {
          0% { transform: translateY(0) scaleY(0.5) scaleX(1); border-radius: 50%; }
          50% { transform: translateY(-24px) scaleX(0.7) scaleY(1.1); }
          100% { transform: translateY(-32px) scaleY(1.4) scaleX(0.8); border-radius: 20% 20% 0 0; }
        }
      `}</style>
    </div>
  );
};

const Scribbler = ({ speed = 1000, color = '#3b82f6' }) => {
  const scribbleAnimation = {
    animation: `scribble ${speed}ms linear infinite`,
    stroke: color,
    strokeWidth: 2,
    fill: 'none',
  };

  return (
    <div
      aria-label="Loading"
      role="status"
      className="flex flex-col items-center justify-center p-4"
    >
      <div className="sr-only">Loading Scribbler...</div>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <path
          d="M32 32 C 32 16, 48 16, 48 32 C 48 48, 16 48, 16 32 C 16 16, 32 16, 32 32 Z"
          style={scribbleAnimation}
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
      <style jsx>{`
        @keyframes scribble {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

const getRandomSpinner = (weights = { drummer: 1, brick: 1, gardener: 1, scribbler: 1 }) => {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  const randomColor = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)];
  const speed = Math.random() > 0.7 ? 400 : 800;

  if ((random -= weights.drummer) < 0) return <Drummer speed={speed} color={randomColor} />;
  if ((random -= weights.brick) < 0) return <BrickLayer speed={speed} color={randomColor} />;
  if ((random -= weights.gardener) < 0) return <Gardener speed={speed} color={randomColor} />;
  return <Scribbler speed={speed} color={randomColor} />;
};

const LoadingSpinner = ({ label }) => {
  const [spinner, setSpinner] = React.useState(null);

  React.useEffect(() => {
    const updateSpinner = () => {
      setSpinner(getRandomSpinner({
        drummer: 1.5,
        brick: 1.2,
        gardener: 1,
        scribbler: 1
      }));
    };

    updateSpinner();
    const interval = setInterval(updateSpinner, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SpinnerWrapper label={label}>
      {spinner}
    </SpinnerWrapper>
  );
};

export {
  Drummer,
  BrickLayer,
  Gardener,
  Scribbler,
  getRandomSpinner,
  LoadingSpinner,
  SpinnerWrapper
};