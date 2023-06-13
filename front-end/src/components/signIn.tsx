import { motion } from 'framer-motion'

import { authContext } from './context/useContext';


const SignIn = () => {
  const authSign = authContext();

  const handleSignIn = () => { authSign.checkAuth() };
  
  return (
    <div className=" w-full flex justify-center items-center p-4 bg-profile-bg bg-cover bg-center backdrop-blur-md h-screen">
      <div className="sign-animation w-[550px] rounded-[10px] border-neutral-950 h-[350px] flex justify-center items-end shadow-md backdrop-blur-xl bg-transparent pb-8">



        <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a03da0e6296d63a6c503040864e2f87ed71295125a6d30ac9b58b101c977867e&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code
        " className='text-white'>Sign In With<span className='pl-2 text-2xl'>42</span></a>
        {/* <motion.button type='button' whileHover={{scale: 1.05}} whileTap={{scale: 0.9}} className='flex items-center text-white bg-fuchsia-900 shadow-inner outline-none'
        onClick={handleSignIn}
        >

            Sign In With <span className='pl-2 text-2xl'>42</span>

        </motion.button> */}
      </div>
    </div>
  )
}

export default SignIn