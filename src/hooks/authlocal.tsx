import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const [formData, setFormData] = useState({
        username:'',
        password:''
    })

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login data:", formData)

        const{ username, password}=formData;

        if (username==='admin' && password==='123') {
            localStorage.setItem("isLoggedIn", "true");
            navigate("/dashboard");
        }else{
            alert("invalid");
        }
    };
    return{formData, setFormData, handleSubmit}
}