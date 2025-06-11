import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { clearUser } from "@features/user/userSlice";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                // ניקוי המשתמש גם מה-localStorage וגם מה-Redux
                localStorage.removeItem('user');
                dispatch(clearUser());

                navigate('/login', { replace: true });
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        logoutUser();
    }, [navigate, dispatch]);

    return (
        <div>
            <h1>Logging out...</h1>
            <p>
                If you are not redirected,{" "}
                <button onClick={() => navigate("/login")}>Click here</button>
            </p>
        </div>
    );
};

export default Logout;
