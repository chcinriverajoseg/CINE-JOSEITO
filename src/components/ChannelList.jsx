import React from "react";

const ChannelList = ({ channels, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 p-4 overflow-y-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Canales Disponibles</h2>
      <ul>
        {channels.map((channel, index) => (
          <li
            key={index}
            onClick={() => onSelect(channel)}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
