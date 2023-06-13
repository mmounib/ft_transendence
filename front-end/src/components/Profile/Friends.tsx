import { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';

const listItems = [
  "Invite a Friend",
  "Create a Channel"
];


const Friends = () => {

  const [IsOpen, setOpen] = useState(false);
  return (
    <div className="flex flex-col top_1 w-[300px] text-gray-400 max-md:w-[95%] bg-red-700">
      <h1 className="text-2xl p-2">Friends List</h1>
      
      <div className="flex flex-col">

        <div className="flex items-center justify-between">

          <div className="flex relative justify-between">
            <input type="search" className="shadow border-0" placeholder="Search a friend..." />
            <button type="button" onClick={() => null} className='absolute left-[65%] mt-3 mr-4'>
              <BiSearchAlt2 size={20} />
            </button>
          </div>

          <div className="flex flex-col relative">
            <button type='button' className='outline-none' onClick={() => setOpen(!IsOpen)}>
              <BsThreeDotsVertical size={20} />
            </button>
            {IsOpen && (
              <div className="flex flex-col justify-between bg-gray-800 opacity-60 rounded-sm text-white absolute top-[3rem] -translate-x-[40%] items-center overflow-hidden transition-all">
                {listItems.map((item, index) => (
                  <span key={index} className='text-xs py-3 cursor-pointer'>{item}</span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Friends List (Icons and Settings) */}

        <div className="flex flex-col">
            <div className="flex">
                  
            </div>      
        </div>

      </div>
    </div>
  );
}

export default Friends;