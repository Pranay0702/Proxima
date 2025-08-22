import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
    children: JSX.Element;
}

const AuthGuard = ({children}: AuthGuardProps) => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');

    if (token && currentUser) {
        return children;
    }else {
        return  <Navigate to ="/login" replace />;
    }
};

export default AuthGuard