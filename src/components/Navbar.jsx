import { getRole, logout, getToken, authHeader } from '../utils/auth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function Navbar() {
    const [role, setRole] = useState(()=> getRole());
    const [userName, setUserName] = useState(null);

    useEffect(()=>{
        async function fetchMe(){
            if(!getToken()) return;
            try{
                const resp = await axios.get(`${API_BASE_URL}/auth/me`, { headers: authHeader() });
                const profile = resp.data?.user ?? resp.data;
                setUserName(profile?.name || profile?.email);
                setRole(profile?.role || getRole());
            }catch(err){
                console.error(err);
            }
        }
        fetchMe();
    },[]);

    const handleLogout = ()=>{
        logout();
    };

    return (
     <div className="navbar">

        <input
         className="search-box"
         placeholder="Search..."
        />

        <div style={{display:'flex',alignItems:'center',gap:16}}>
            {getToken() ? (
                <>
                    <div style={{fontWeight:700}}>{userName || 'User'}</div>
                    <div style={{fontWeight:600}}>Role: {role}</div>
                    <button className="btn-primary" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <div style={{fontWeight:600}}>Not logged in</div>
            )}
        </div>

     </div>
    );
}