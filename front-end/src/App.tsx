// import { useState, useEffect, useContext } from 'react'

import { Navbar, HomePage, Profile, SignIn, Chat } from './components/index'
import { Outlet, redirect } from 'react-router-dom';
import { authContext } from './components/context/useContext';

import { Navigate } from "react-router-dom";

import React from 'react';

import './App.css'

import {
  Route,
  Routes,
} from "react-router-dom";

export const ProtectedRoute: React.FC<{children: any}> = ( { children } ) => {
  const auth = authContext();
  // const location = useLocation();

  console.log("here is : " + auth.isAuthenticated);

  if (!auth.isAuthenticated)
    return <Navigate to="/" replace />;


  return ( children );
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
  console.log("first");
  const authApp = authContext();

  // if (authApp.isAuthenticated)
  //   return redirect("/Home");
  console.log("in the app: " + authApp.isAuthenticated);
  return (
    <div className=' h-[1020px]'>
      <div className=' w-full flex absolute top-1/2 -translate-y-1/2 max-sm:top-0 max-sm:-translate-y-0'>

        {/* <Navbar />
        <Routes>
          <Route path='/' element={(<Chat />)}/>
        </Routes> */}
        
        {authApp.isAuthenticated && <Navbar />}

          {!authApp.isAuthenticated && <SignIn />
          }
        <Routes>
          <Route path='/' >
            <Route index element={(<ProtectedRoute> <HomePage /> </ProtectedRoute>)}/>
            <Route path='Home' element={(<ProtectedRoute> <HomePage /> </ProtectedRoute>)}/>
            <Route path='Profile' element={(<ProtectedRoute> <Profile /> </ProtectedRoute>)}/>
            <Route path='Chat' element={(<ProtectedRoute> <Chat /> </ProtectedRoute>)}/>
          </Route>
          
        </Routes>
      </div>
    </div>
  )
}

export default App
