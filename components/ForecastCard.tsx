import React from 'react';
import Image from 'next/image';
import moment from 'moment';

interface ForecastData {
  date: number;
  icon: string;
  temp: number;
}

interface ForecastCardProps {
  data: ForecastData;
  className?: string; 
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data, className }) => {
  return (
<div className="bg-white rounded-lg p-4 shadow-md w-full md:w-auto">
    <h3 className="text-xl font-bold mb-2">{moment.unix(data.date).format('MMM Do')}</h3>
      <Image
        src={`http://openweathermap.org/img/wn/${data.icon}.png`}
        alt="weather icon"
        width={50}
        height={50}
        className="mb-2"
      />
      <p>{Math.round(data.temp)} °F</p>
    </div>
  );
};

export default ForecastCard;



  