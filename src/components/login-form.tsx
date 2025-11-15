import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeftIcon } from "lucide-react"
import type { LoginDto } from "@/api/auth" // import the LoginDto type
import { useNavigate } from "react-router-dom"

interface LoginFormProps extends React.ComponentProps<"div"> {
  formData: LoginDto
  setFormData: React.Dispatch<React.SetStateAction<LoginDto>>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
}

export function LoginForm({
  className,
  formData,
  setFormData,
  handleSubmit,
  loading,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-32 text-primary outline-blue-500" 
            onClick={()=>navigate("/")}
            >
              <ArrowLeftIcon/>Kembali
          </Button>
      <Card className="shadow-lg">
        <CardHeader className="text-center gap-8">
          <img src="/images/logoname.png" alt="logo" className="mx-auto w-72 h-auto" />
          <CardTitle className="text-xl">Login Administrator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {/* Username */}
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username..."
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>

                {/* Password with toggle button */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password..."
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
