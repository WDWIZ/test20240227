import { Routes, Route, useLocation } from 'react-router-dom';

import pages from './pages/pages';

import Header from "./components/header";
import { useState, useEffect } from 'react';

import "./assets/scripts/socketHandler";
import socketHandler from './assets/scripts/socketHandler';
import { SocketProvider } from './hooks/socketProvider';

function App(){
    const { pathname } = useLocation();
    const title = import.meta.env.VITE_TITLE;
    const [ subtitle, setSubtitle ] = useState("");
    const [ pageID, setpageID ] = useState("");
    const [ socket, setSocket ] = useState(null);

    const [ isLogined, setIsLogined ] = useState(false);
    const [ userData, setUserData ] = useState({
        isLogined: false,
        data: {}
    });

    useEffect(() => {
        const { "subtitle" : newSubtitle } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        const { "id" : newID } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        setSubtitle(newSubtitle);
        setpageID((newID == "home") ? "" : newID);

        document.title = title + ' : ' + newSubtitle;

        if (isLogined && !socket) {
            const socketFunc = socketHandler();
            setSocket(socketFunc);
            socketFunc.emit("login", userData.data);
        }
    }, [pathname, isLogined] );

    useEffect(() => {
        let { "id" : newID } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        newID = (newID == "home") ? "" : newID;
        
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };
      
        const cookieUserData = decodeURIComponent(getCookie('userData'));
      
        if (cookieUserData == "undefined") { window.location.href=`https://iam.jshsus.kr?service=newjshsus&successURL=${newID}` }

        else{
            setIsLogined(true);
            const data = JSON.parse(cookieUserData);
            setUserData({ isLogined: true, data });
            document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }, []);

    return(
        <>
            <Header subtitle={subtitle} userData={userData} />
            <SocketProvider socket={socket}>
                <Routes>
                    { pages.map(p => <Route key={p.id} path={p.path} element={<p.comp />}/>) }
                </Routes>
            </SocketProvider>
        </>
    );
}

export default App;