import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { authHeader } from '../utils/auth';

export default function Profile(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugRaw, setDebugRaw] = useState(null);

  useEffect(()=>{
    async function fetchProfile(){
      try{
        const resp = await axios.get('http://localhost:4000/auth/me', { headers: authHeader() });
        setDebugRaw(resp.data);
        const profile = resp.data?.user ?? resp.data;
        if(!profile){
          throw new Error('Could not load profile');
        }
        setUser(profile);
      }catch(err){
        console.error(err);
        setDebugRaw(err.response?.data ?? null);
        setError(err.response?.data?.message || err.message || 'Unable to load profile');
      }finally{
        setLoading(false);
      }
    }
    fetchProfile();
  },[]);

  if(loading) return <div className="p-8">Loading profile...</div>;
  if(error) return <div className="p-8">{error}</div>;

  // show debug raw response when available for easier troubleshooting
  const DebugView = () => (
    debugRaw ? (
      <div style={{padding:16,marginTop:12,background:'#fff',borderRadius:8}}>
        <strong>Raw response:</strong>
        <pre style={{whiteSpace:'pre-wrap',maxHeight:240,overflow:'auto'}}>{JSON.stringify(debugRaw,null,2)}</pre>
      </div>
    ) : null
  );

  return (
    <div className="main-container">
      <Sidebar />
      <div className="dashboard">
        <Navbar />
        <h2 className="dashboard-title">Profile</h2>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-badge">Personal Details</div>
            <h3>{user.name || user.email}</h3>
            <p className="profile-text"><strong>Role:</strong> {user.role || 'User'}</p>
            <p className="profile-text"><strong>Email:</strong> {user.email || 'Not available'}</p>
            {user.phone && <p className="profile-text"><strong>Phone:</strong> {user.phone}</p>}
          </div>

          <div className="profile-card profile-summary">
            <div className="profile-badge">Account Summary</div>
            <div className="profile-stat">
              <span>Status</span>
              <strong>{user.status || 'Active'}</strong>
            </div>
            <div className="profile-stat">
              <span>Joined</span>
              <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</strong>
            </div>
            <div className="profile-stat">
              <span>Assigned Leads</span>
              <strong>{user.assignedLeads ?? 'N/A'}</strong>
            </div>
            <DebugView />
          </div>
        </div>
      </div>
    </div>
  );
}
