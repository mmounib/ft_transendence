
// import { motion } from 'framer-motion'

import { Live, Results, TopPlayers } from './Container'
import img from "../../assets/ping-pong-player-darkbg.png"
import { authContext } from '../context/useContext'

// import { VscAccount as AccountIcon } from 'react-icons/vsc'

const HomePage = () => {
  const authUser = authContext();


  return (
    <>
    {/* // <div className="  flex flex-col bg-profile-bg bg-cover bg-center rounded-[10px] max-sm:rounded-none w-[80%] mx-auto max-w-[1700px] h-[85vh] max-md:w-[95%] max-sm:w-full max-sm:bg-none max-sm:drop-shadow-none max-sm:h-screen"> */}
      {/* <div className="flex text-white items-center purple_back rounded-[0] bg-blue-950 gap-6 p-3 px-6 flex-row-reverse  w-[70%] mx-auto my-5">
        <img src={authUser.user?.avatar} alt="" className=' cursor-pointer object-cover rounded-full w-[45px] h-[45px]' />
        <AccountIcon size={32} className='cursor-pointer'/>
      </div> */}
      <div className=" rounded-[10px]">
        
        <div className="mt-4 mx-4 h-[calc(300px_-_2rem)] max-sm:h-[calc(200px_-_1rem)] bg-image-bg bg-cover rounded-[25px]">
          <div className="   flex flex-row-reverse items-center justify-around max-sm:backdrop-blur-md">
            <div className="flex backdrop-blur-md w-[60%] max-sm:backdrop-blur-0 align-bottom  h-[calc(300px_-_2rem)] max-sm:h-[calc(200px_-_1rem)]">
              <img src={img} className=' -mt-[1rem] h-[350px] w-[350px] max-sm:h-[220px] max-sm:w-[220px] max-sm:mt-0 ml-auto'/>
            </div>
            <div className="flex flex-col text-center items-center gap-4 uppercase">
              <div className="text-white mask">
                <h1 className='hide text-4xl max-sm:text-base'>You Wanna Play Now! Click The Play Button Below</h1>
              </div>
              <div className="text-white mask mt-5 max-sm:mt-1">
                <a href="/Play" className=' bg-purple-900 flex rounded-[10px] py-[12px] px-[40px] uppercase hide delay-[3s] max-sm:py-[7px] max-sm:px-[20px]'>Play Now!</a>
              </div>
            </div>
          </div>
        </div>
          {/* <div className=" rounded-t-[10px] h-[200px] contrast-75 saturate-75 bg-cover bg-no-repeat bg-center w-full bg-image-bg object-cover">

            <div className=" overflow-hidden h-full max-w-[1200px] mx-auto font-bold flex text-white justify-between px-[8rem] max-sm:px-[1rem] items-center ">
              <h1 className='heading text-white max-sm:hidden'>PING <br/> PONG</h1>
              <motion.button type='button' whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => null} className=' bg-[#BD6161] outline-none max-sm:mx-auto max-sm:mt-auto max-sm:mb-[5px] max-sm:px-[50px] max-sm:text-xs'>PLAY NOW!</motion.button>
            </div>

          </div> */}

          <div className=" text-white flex text-center w-[90%] mx-auto mt-[3rem] max-md:w-[85%] max-md:flex-col max-md:mt-3 ">
            <Live />
            <Results />
          </div>
          <TopPlayers />
      </div>
    </>
  )
  {/* </div> */}
}

export default HomePage
