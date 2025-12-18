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
import { ChevronDownIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_SCHOOLS } from "@/api/api"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import * as React from "react"
import { toast } from "sonner"

export function SchoolAddDialog({
  open,
  onOpenChange,
  onSuccess, 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [npsn, setNPSN] = React.useState("")
  const [school, setSchool] = React.useState("")
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
    toast.error("Harap isi semua data diisi.");
    setLoading(false);
    return;
  }

  const payload: SchoolPayload = {
    nisn: npsn,
    school_name: school,
  };

  try {
    const res = await fetchWithAuth(API_SCHOOLS, {
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
    toast.error("Gagal menambahkan laporan."+err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Laporan</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="title">NPSN</Label>
            <Input
              id="NPSN"
              value={npsn}
              placeholder="Masukkan NPSN"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundsource">Nama Sekolah</Label>
            <Input
              id="fundsource"
              value={school}
              placeholder="Masukkan Nama Sekolah"
              onChange={(e) =>setSchool(e.target.value)}
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
