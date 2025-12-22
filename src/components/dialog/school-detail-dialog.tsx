import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_SCHOOLS } from "@/api/api"
import { Label } from "@/components/ui/label"

import * as React from "react"
import { toast } from "sonner"

export function SchoolDetailDialog({
  open,
  onOpenChange,
  onSuccess,
  school,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  school: any
}) {
  const [npsn, setNPSN] = React.useState("")
  const [schoolName, setSchoolName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 8);
    setNPSN(rawValue)
  }

interface SchoolPayload {
  nisn: string;
  school_name: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  if (!npsn || !school) {
    toast.error("Harap isi semua data .");
    setLoading(false);
    return;
  }

  const payload: SchoolPayload = {
    nisn: npsn,
    school_name: schoolName,
  };

  try {
    const res = await fetchWithAuth(`${API_SCHOOLS}/${school.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("✅ Report:", res);
    toast.success("Laporan berhasil disimpan!");
    onOpenChange(false);
    onSuccess?.();
  } catch (err) {
    console.error("❌ Error submitting report:", err);
    toast.error("Gagal menambahkan laporan."+err);
  } finally {
    setLoading(false);
  }
};
const resetForm = React.useCallback(() => {
  setNPSN(school?.nisn || "")
  setSchoolName(school?.school_name || "")
  setLoading(false)
}, [school])

React.useEffect(() => {
  if (open) {
    resetForm()
  }
}, [open, resetForm])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perbarui Sekolah</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="title">NPSN</Label>
            <Input
              required
              id="NPSN"
              value={npsn}
              placeholder="Masukkan NPSN"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundsource">Nama Sekolah</Label>
            <Input
              required
              id="school"
              value={schoolName}
              placeholder="Masukkan Nama Sekolah"
              onChange={(e) =>setSchoolName(e.target.value)}
            />
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
