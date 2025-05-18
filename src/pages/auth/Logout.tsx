import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                // קריאה ל-API לlogout
                await axios.post("/api/logout", {}, { withCredentials: true });

                // כאן אפשר לנקות כל מצב לוקאלי (לדוגמה localStorage)
                localStorage.removeItem("userInfo");

                // מעבר לעמוד Login עם החלפה ב-history (replace)
                navigate("/login", { replace: true });
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <div>
            <h1>Logging out...</h1>
            <p>If you are not redirected, <button onClick={() => navigate("/login")}>Click here</button></p>
        </div>
    );
};

export default Logout;
