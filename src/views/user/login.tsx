
import { useLogin } from "@/controllers/calls"
import { AuthLayout } from "../layout/authlayout"
import { LoginForm } from "@/components/login-form"
// import { Toaster } from "@/components/ui/sonner";
export default function LoginPage() {
  const { formData, setFormData, handleSubmit, loading} = useLogin();
  return (
    
    <AuthLayout>
      <LoginForm 
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      loading = {loading}
      />
    </AuthLayout>
  )
}