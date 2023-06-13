// import { useState, useEffect, useContext } from 'react'

import { Navbar, HomePage, Profile, SignIn, Chat } from './components/index'

import { authContext } from './components/context/useContext';

import { Navigate, useRouteError } from "react-router-dom";

import React from 'react';

import './App.css'

import {
  Route,
  Routes,
} from "react-router-dom";

export const ProtectedRoute: React.FC<{children: any}> = ( { children } ) => {
  const auth = authContext();

  return (
    auth.isAuthenticated ? (
      children
    ) : (
      <Navigate to="/" replace />
    )
  )
}

// function NotFound() {
//   const error: any = useRouteError();

//   return (
//     <div className='text-2xl text-white'>
//       <h1 className='text-center'>Oops!</h1>
//       <p className='text-center'>Sorry, an unexpected error has occurred.</p>
//       <p>
//         <i>{error.statusText || error.message}</i>
//       </p>
//     </div>
//   );
// }


const App = () => {
  const authApp = authContext();

  console.log("auth: " + authApp.isAuthenticated);

  return (
    <div className=' h-[1020px]'>
      <div className=' w-full flex absolute top-1/2 -translate-y-1/2 max-sm:top-0 max-sm:-translate-y-0'>

        {/* <Navbar />
        <Routes>
          <Route path='/' element={(<Chat />)}/>
        </Routes> */}
        
        {authApp.isAuthenticated && <Navbar />}

        <Routes>
          {!authApp.isAuthenticated ? <Route path='/' element={(<SignIn />)}/> : <Route path='/Home' element={<HomePage />}/> }
          
          {/* <Route path='/Home' element={(<ProtectedRoute> <HomePage /> </ProtectedRoute>)}/> */}
          <Route path='/Profile' element={(<ProtectedRoute> <Profile /> </ProtectedRoute>)}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
