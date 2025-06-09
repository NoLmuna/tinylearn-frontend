import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

const weatherIcons = {
  Clear: WiDaySunny,
  Clouds: WiCloudy,
  Rain: WiRain,
};

export default function WeatherWidget({ className = '' }) {
  const [weather, setWeather] = useState({
    temp: '22°C',
    condition: 'Clear'
  });

  useEffect(() => {
    const conditions = ['Clear', 'Clouds', 'Rain'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * (30 - 15) + 15);

    setWeather({
      temp: `${randomTemp}°C`,
      condition: randomCondition
    });
  }, []);

  const WeatherIcon = weatherIcons[weather.condition];

  return (
    <Motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 ${className}`}
    >
      {WeatherIcon && <WeatherIcon className="w-10 h-10 text-yellow-500" />}
      <div className="text-left">
        <p className="text-2xl font-bold text-gray-800">{weather.temp}</p>
        <p className="text-sm text-gray-600">{weather.condition}</p>
      </div>
    </Motion.div>
  );
}
