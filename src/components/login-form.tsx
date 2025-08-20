
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/authlocal"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { formData, setFormData, handleSubmit } = useLogin()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="text-middle">
          <img src="/images/logo.png" alt="logo" className="mx-auto w-24 h-auto" />
          <CardTitle className="text-xl">
            Login Administrator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username..."
                    required
                    value={formData.username}
                    onChange={(e)=>
                      setFormData({...formData, username: e.target.value})
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password..."
                    required 
                    value={formData.password}
                    onChange={(e)=>
                    setFormData({...formData, password: e.target.value})
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
