import { Howl } from 'howler';
import React, { useCallback } from 'react';

let clickSound, hoverSound;

try {
  clickSound = new Howl({
    src: ['https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'],
    volume: 0.3,
    preload: false,
  });

  hoverSound = new Howl({
    src: ['https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3'],
    volume: 0.15,
    preload: false,
  });
} catch (error) {
  console.warn('Audio failed to initialize:', error);
}

const colorMap = {
  blue: 'bg-blue-400 hover:bg-blue-500 focus:ring-blue-200',
  green: 'bg-green-400 hover:bg-green-500 focus:ring-green-200',
  purple: 'bg-purple-400 hover:bg-purple-500 focus:ring-purple-200',
  pink: 'bg-pink-400 hover:bg-pink-500 focus:ring-pink-200',
  yellow: 'bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-200',
};

export default function PlayfulButton({
  children,
  icon: Icon,
  className = '',
  color = 'blue',
  onClick,
  type = 'button',
  ...props
}) {
  const handleClick = useCallback(
    e => {
      if (clickSound?.play) clickSound.play();
      onClick?.(e);
    },
    [onClick]
  );

  const handleHover = useCallback(() => {
    if (hoverSound?.play) hoverSound.play();
  }, []);

  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg text-white transition-all outline-none focus:ring-4 ${colorMap[color] || colorMap.blue} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleHover}
      {...props}
    >
      {Icon && <Icon className="h-7 w-7" />}
      {children}
    </button>
  );
}