import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function ProtectedRoute(props) {

    const {user,loading}=useAuth();
    const location =useLocation();

    if(loading){return <LoadingSpinner></LoadingSpinner>;}
    if(!user){
        return <Navigate to='/login' state={{ from: location.pathname }} replace />;

    }
    return props.children;

}

export default ProtectedRoute;