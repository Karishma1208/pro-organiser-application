import React,{useState,useEffect} from 'react';
import {firebaseApp as app} from '../Firebase/config';

export const AuthContext=React.createContext();



export const Authentication=({children})=> {

    const [currentUser,SetCurrentUser]=useState('');

    useEffect(()=>{
        app.auth().onAuthStateChanged(SetCurrentUser);
    },[]);

    return (
        <AuthContext.Provider
        value={{currentUser}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default Authentication
