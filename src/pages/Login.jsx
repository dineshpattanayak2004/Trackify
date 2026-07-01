import { Link } from "react-router-dom";

export default function Login() {

 return (
  <div className="login-page">

   <div className="login-card">

    <h1>
      Trackify
    </h1>

    <p className="login-description">
      Select your login type to continue into Trackify.
    </p>

    <div className="login-actions">
      <Link to="/user-login" className="btn-primary login-link">User Login</Link>
      <Link to="/admin-login" className="btn-primary login-link">Admin Login</Link>
      <Link to="/distributor/login" className="btn-primary login-link distributor-login-link">Distributor Login</Link>
    </div>

   </div>

  </div>
 );
}