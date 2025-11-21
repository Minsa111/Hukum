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
import { API_PURCHASE } from "@/api/api"
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

export function EditFundDialog({
  open,
  onOpenChange,
  onSuccess, 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [title, setTitle] = React.useState("")
  const [fundsource, setFundsource] = React.useState("")
  const [value, setValue] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formatted = rawValue ? Number(rawValue).toLocaleString("id-ID") : ""
    setValue(formatted)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!title || !fundsource || !value || !date) {
      toast.error("Harap isi semua data diisi.")
      setLoading(false)
      return
    }
    const payload = {
      title,
      funding_sources: [
        {
          source_of_fund: fundsource,
          budget_amount: parseInt(value.replace(/\D/g, ""), 10),
          received_date: date ? date.toLocaleDateString("sv-SE") : null,
        },
      ],
    }

    try {
      const res = await fetchWithAuth(API_PURCHASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      console.log("✅ Report:", res.status)
      toast.success("Laporan berhasil ditambahkan!")
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
          <DialogTitle>Tambah Laporan</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-3">
            <Label htmlFor="title">Laporan Pembelanjaan</Label>
            <Input
              id="title"
              value={title}
              placeholder="Masukkan Nama Laporan Pembelanjaan"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundsource">Sumber Dana</Label>
            <Input
              id="fundsource"
              value={fundsource}
              placeholder="Masukkan Sumber Dana"
              onChange={(e) => setFundsource(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="date">Tanggal Dana Diterima</Label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                  {date ? date.toLocaleDateString() : "Pilih tanggal"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0 z-[9995]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date)
                    setOpenDate(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundcurr">Jumlah Nominal</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>Rp.</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="fundcurr"
                placeholder="1.000.000"
                className="!pl-1"
                value={value}
                onChange={handleChange}
              />
            </InputGroup>
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
