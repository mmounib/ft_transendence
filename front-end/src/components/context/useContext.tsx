import React from "react";
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
// import { Navigate } from "react-router-dom";

// import { useCookies } from "react-cookie";

import Cookies from 'js-cookie';


interface User {
    id: number;
    username: string;
    avatar: string;
    wins: number;
    loss: number;
    winrate: number;
    two_factors_enabled: string;
    intraId: number
    // Add any other relevant user information
}

interface AuthContextType {
    // checkAuth: () => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAccessToken: () => Promise<void>;
    user: User | null;
}

  
const AuthContext = createContext<AuthContextType>({
    // checkAuth: () => Promise.resolve(),
    logout: () => {},
    isAuthenticated: false,
    refreshAccessToken: () => Promise.resolve(),
    user: null,
});

// const AuthContext = createContext({});

export const AuthProvider: React.FC<{ children: any }> = ( { children } ) => {

    const [accessToken, setAccessToken] = useState<any | null>(null);
    const [refreshToken, setRefreshToken] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);


    // const [cookie, setCookie, removeCookie] = useCookies(["accessTokenCookie", "refreshTokenCookie"]);

    // const navigate = useNavigate();


    const refreshAccessToken = async () => {
        try {
            const response = await axios.get("http://localhost:5000/auth/refresh-token", {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
            }, });

            const newAccessToken = response.data.access_token;
            
            setAccessToken(newAccessToken);

            // setCookie("accessTokenCookie", accessToken, { path: '/', httpOnly: true});

        } catch (error) {
            ///////// if the refresh token has expired... // we need to do something /////////////
        }
    };

    const logout = async () => {

        console.log("Logged Out");
        
        const jResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        
        try {
            const res = await axios.post("/logout", jResponse);

            console.log(res);

            // removeCookie('accessTokenCookie', { path: '/' });
            // removeCookie('refreshTokenCookie', { path: '/' });
    
            setIsAuthenticated(false);
        } catch (error) {
            
        }
    }

    useEffect( () => {
        const checkAuthentication = async () => {
            try {
                const access_Token = Cookies.get('access_token');
                const refresh_Token = Cookies.get('refresh_token');
                
                setAccessToken(access_Token)
                setRefreshToken(refresh_Token);

                
                console.log(accessToken);
                if (!access_Token)
                {
                    console.log("No Tokeeen");
                    // Need to redirect to sign in page
                    setIsAuthenticated(false);

                    return ;
                }

                // axios.defaults.headers.common['Cookie'] = accessToken;
                else {
                    const response = await axios.get('http://localhost:3000/auth/user', {
                        headers: {
                            Authorization: `Bearer ${access_Token}`
                        }
                    });
                    setUser(response.data.user);
                    // const userData = response.data.user;
                    
                    setIsAuthenticated(true);
                }
            } catch (error: any) {
                // don't know what to do in here
            }
        }

        checkAuthentication();
    }, []);
    
    return (
        <AuthContext.Provider value={{logout, isAuthenticated, refreshAccessToken, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const authContext = () => useContext(AuthContext);

// check if the user has cookie--> 1 - true: extract the tokens and send them to the route /auth/intra.
                                    //2 false:send a request to the route /auth/callback, and wait for the response that contains the access_token and refresh_token.

// auth/callback --> the user has no cookie
//auth/intra ---> the user has a cookie
//auth/refresh-token --> the user access_token has expired, and need a new access_token via refresh_token.0














