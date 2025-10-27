import { loginUser } from "../../api/auth";
import type { LoginDto, LoginResponse } from "../../api/auth";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
    exp?: number;
    sub?: string;
    username?: string;
    role?: string;
}
export function validateToken(): { valid: boolean; expired: boolean; user?: JwtPayload } {
    const token = localStorage.getItem("token");
    if (!token) return { valid: false, expired: true };

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (!decoded.exp) return { valid: false, expired: true };
        const isExpired = Date.now() >= decoded.exp * 1000;

        return {
            valid: !isExpired,
            expired: isExpired,
            user: decoded,
        };
    } catch (err) {
        console.error("Invalid token:", err);
        return { valid: false, expired: true };
    }
}

export async function loginController(
    data: LoginDto
): Promise<LoginResponse> {
    const response = await loginUser(data);
    // token expires in 30 minutes — match backend setting
    const tokenExpiration = new Date();
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 30);
    const decoded = jwtDecode<JwtPayload>(response.access_token);

    localStorage.setItem("token", response.access_token);
    localStorage.setItem("school_id", response.user.school_id);
    localStorage.setItem("tokenExpiration", tokenExpiration.toISOString());
    localStorage.setItem("username", decoded.username ?? "");
    return response;
}

export function useLogoutController(){
    const navigate = useNavigate();
    return () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("username");
        localStorage.removeItem("school_id");
        navigate("/auth/login");
    }
}
