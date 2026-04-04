import { Navigate } from "react-router";


export const ProtectedRoutes = ({ children }) => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            return <Navigate to="/login" />
        }

        return children
    }catch(error){
        console.log('ProtectedRoutes: ', error);
        throw error
        
    }
}