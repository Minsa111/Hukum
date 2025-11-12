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
      const res = await loginController(formData);
      if (res){
        if(res.user.role === "instansi"){
          navigate("/admin");
        }else if(res.user.role === "admin"){
          navigate("/superadmin");
        }else{
          navigate("/404");
        }
      }
      toast.success("Login successful!");
    } catch (err) {
      console.error(err);
      toast.error(`Login failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleSubmit, loading };
}

