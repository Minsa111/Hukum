// src/components/report-shop-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_SCHOOLS, API_USERS } from "@/api/api"
import { Label } from "@/components/ui/label"
import * as React from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function AccountAddDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [role, setRole] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [school, setSchool] = React.useState("")
  const [schools, setSchools] = React.useState<School[]>([])//for data
  const [loading, setLoading] = React.useState(false)
  const [date, setDate] = React.useState(new Date())
  const [openDate, setOpenDate] = React.useState(false)


  interface SchoolPayload {
    username: string;
    password: string;
    role: string;
    status: string;
    school_id: string;
  }
  interface School {
  id: string
  school_name: string
}


  async function loadSchools() {
    try {
      const response = await fetchWithAuth(API_SCHOOLS)
      setSchools(response)
    } catch (error) {
      toast.error("Gagal mengambil data sekolah")
      console.error(error)
      return []
    }
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !school || !password || !role || !status) {
      toast.error("Harap isi semua data diisi.");
      setLoading(false);
      return;
    }

    const payload: SchoolPayload = {
      username: username,
      password: password,
      role: role,
      status: status,
      school_id: school
    };

    try {
      const res = await fetchWithAuth(API_USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("✅ Report:", res);
      toast.success("Laporan berhasil ditambahkan!");

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      toast.error("Gagal menambahkan laporan." + err);
    } finally {
      setLoading(false);
    }
  };
    React.useEffect(() => {
    if (!open) return

    async function fetchSchools() {
      const data = await loadSchools()
      if (data) {
        setSchools(data)
      }
    }

    fetchSchools()
  }, [open])



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Akun</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="usename"
              value={username}
              placeholder="Masukkan Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password"
                      required
                      value={password}
                      onChange={(e) =>setPassword(e.target.value)}
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
          <div className="grid gap-3">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="instansi">Instansi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="school">Sekolah</Label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Sekolah" />
                </SelectTrigger>

                <SelectContent>
                  {schools.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Enabled</SelectItem>
                <SelectItem value="inactive">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Menyimpan...
                </>
              ) : (
                "Tambah"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
