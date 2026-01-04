/* eslint-disable react/prop-types */
import React from 'react'
import { FaClosedCaptioning, FaMicrophone } from 'react-icons/fa'

const SoundsInfo = ({ episodes }) => {
  return (
    <div className=" rounded-child flex flex-wrap font-extrabold">
      {episodes.rating && (
        <p className="item bg-white text-sm px-2  text-black">
          <span className="text-sm font-extrabold">{episodes.rating}</span>
        </p>
      )}
      <p className="item bg-yellow text-sm px-1 text-black">
        <FaClosedCaptioning />
        <span className="text-sm font-bold">{episodes.sub}</span>
      </p>

      <p className="item bg-purple px-1 text-[12px] text-black">
        <FaMicrophone />
        <span className="text-sm font-bold">{episodes.dub}</span>
      </p>

      <p className="item px-1 text-black text-sm bg-pink">{episodes.eps}</p>
    </div>
  )
}

export default SoundsInfo
