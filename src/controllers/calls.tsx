// so called "hooks"
import { useState } from "react";
import type { LoginDto } from "@/api/auth";
import { loginController } from "@/controllers/auth/authcontroller";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const [formData, setFormData] = useState<LoginDto>({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await loginController(formData);
            navigate("/dashboard");
            toast.success("Login successful!");
        } catch (err) {
            console.error(err);
            toast.error(`Login failed: ${err}`);
            // console.log(err);
            // You can show a toast error here too
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, handleSubmit, loading };
}
