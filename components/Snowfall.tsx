import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate static array of random values to render snowflakes
    const flakes = Array.from({ length: 50 }).map((_, i) => i);
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snow-container">
      {snowflakes.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10;
        const opacity = 0.3 + Math.random() * 0.7;
        const delay = Math.random() * 5;

        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${left}vw`,
              animationDuration: `${animationDuration}s`,
              animationDelay: `${delay}s`,
              opacity: opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;
