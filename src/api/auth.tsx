import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginDto {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    message: string;
    user: {
        id: string;
        usename: string;
        role: string;
        school_id: string;
        school_name: string;
    };
}


export async function loginUser(loginDto: LoginDto): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(
            `${API_URL}/auth/login`,
            loginDto
        );
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        throw new Error(err.response?.data.message || "Login failed");
    }
}
