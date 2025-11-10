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
import {Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_PURCHASE } from "@/api/api"
import { Label } from "@/components/ui/label"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Calendar } from "../ui/calendar"
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
//   InputGroupText,
// } from "../ui/input-group"
import * as React from "react"
import { toast } from "sonner"

export function EditReportShopEdDialog({
  open,
  onOpenChange,
  report,
  onSuccess, 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: any
  onSuccess?: () => void
}) {
  const [title, setTitle] = React.useState(report?.title || "")
  const [loading, setLoading] = React.useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title, 
    }

    try {
      await fetchWithAuth(`${API_PURCHASE}/${report.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      toast.success("Laporan berhasil diperbarui!")
      onOpenChange(false)
      onSuccess?.() 
    } catch (err) {
      console.error("❌ Error submitting report:", err)
      toast.error("Gagal menambahkan laporan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Laporan</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="title">Judul Laporan Pembelanjaan</Label>
            <Input
              id="title"
              value={title}
              placeholder="Ubah Judul Laporan Pembelanjaan"
              onChange={(e) => setTitle(e.target.value)}
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
