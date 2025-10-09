import { loginUser } from "../../api/auth";
import type { LoginDto, LoginResponse } from "../../api/auth";
import {jwtDecode} from "jwt-decode";

export async function loginController(
    data: LoginDto
): Promise<LoginResponse> {
    const response = await loginUser(data);
    // token expires in 30 minutes — match backend setting
    const tokenExpiration = new Date();
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 30);
    
    localStorage.setItem("token", response.access_token);
    localStorage.setItem("tokenExpiration", tokenExpiration.toISOString());
    console.log(jwtDecode(response.access_token));
    return response;
}
