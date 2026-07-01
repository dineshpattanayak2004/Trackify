import { Navigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth';
import ErrorBoundary from './ErrorBoundary';

export default function ProtectedRoute({ children, allowedRoles }){
  const token = getToken();
  if(!token) return <Navigate to='/' replace />;
  if(allowedRoles && allowedRoles.length){
    const role = getRole();
    if(!allowedRoles.includes(role)){
      return <Navigate to='/' replace />;
    }
  }
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
