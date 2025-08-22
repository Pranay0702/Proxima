import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface LoginGuardProps {
    children: JSX.Element;
}
const  LoginGuard = ({ children }: LoginGuardProps) => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');

    if (token && currentUser) {
        return <Navigate to="/" replace />;
    }else {
        return children;
    }
};

export default LoginGuard;