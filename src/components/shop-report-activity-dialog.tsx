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
import { API_PURCHASE, API_ACTIVITY } from "@/api/api"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "./ui/calendar"
import { useParams } from "react-router-dom"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group"
import * as React from "react"
import { toast } from "sonner"

export function ReportShopActivityDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [activity, setActivty] = React.useState("")
  const [spendingAccount, setSpendingAccount] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [unit, setUnit] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const { purchase_report_id } = useParams<{ purchase_report_id: string }>()  
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.")
      e.target.value = "" // reset the input
      return
    }
    setFile(selectedFile || null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formatted = rawValue ? Number(rawValue).toLocaleString("id-ID") : ""
    setPrice(formatted)
  }  
  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    setQuantity(rawValue)
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setSubmitted(true)
  setLoading(true)

  const isEmpty = !activity || !spendingAccount || !price || !date || !quantity || !unit || !description
  if (isEmpty) {
    setLoading(false)
    return toast.error("Lengkapi form terlebih dahulu.")
  }

  try {
    const formData = new FormData()
    formData.append("purchase_report_id", purchase_report_id || "")
    formData.append("activity", activity)
    formData.append("activity_date", date ? date.toISOString().split("T")[0] : "")
    formData.append("spending_account", spendingAccount)
    formData.append("description", description)
    formData.append("unit_price", price.replace(/\D/g, ""))
    formData.append("quantity", quantity)
    formData.append("unit", unit)
    if (file) formData.append("supporting_file", file)


    await fetchWithAuth(`${API_PURCHASE}${API_ACTIVITY}`, {
      method: "POST",
      body: formData, 
    })

    toast.success("Laporan berhasil ditambahkan!")
    onOpenChange(false)
    onSuccess?.() 

  } catch (err) {
    console.error("❌ Error submitting:", err)
    toast.error("Gagal menambahkan laporan.")
  } finally {
    setLoading(false)
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Tambah Laporan</DialogTitle>
          <DialogDescription>Isi form berikut.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-1">
          
          <div className="grid gap-3">
            <Label htmlFor="activity">Kegiatan</Label>
            <Input
              id="activity"
              value={activity}
              placeholder="Masukkan Kegiatan"
              onChange={(e) => setActivty(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="date">Tanggal Kegiatan</Label>
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className=" justify-between font-normal">
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
            <Label htmlFor="spendingAccount">Rekening Belanja</Label>
            <Input
              
              id="spendingAccount"
              value={spendingAccount}
              placeholder="Apa jenis rekening belanja untuk kegiatan tersebut?"
              onChange={(e) => setSpendingAccount(e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="picture">File Pendukung</Label>
              <Input 
                id="picture" 
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
          </div>

          <div className="flex flex-row items-start justify-between gap-3">
            <div className="grid w-1/2 gap-3">
              <Label htmlFor="description">Uraian</Label>
              <Input
                id="description"
                value={description}
                placeholder="Apa detail barang dan jasanya?"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid w-1/2 gap-3">
              <Label htmlFor="price">Harga Satuan</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>Rp.</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="price"
                  placeholder="1.000.000"
                  className="!pl-1"
                  value={price}
                  onChange={handleChange}
                />
              </InputGroup>
            </div>
          </div>
          
          <div className="flex flex-row items-start justify-between gap-3">
            
            <div className="grid w-1/2 gap-3">
              <Label htmlFor="quantity">Kuantitas</Label>
              <InputGroup>
                <InputGroupInput
                  id="quantity"
                  placeholder="Masukkan Jumlah"
                  className="!pl-1"
                  value={quantity}
                  onChange={handleNumber}
                />
              </InputGroup>
            </div>

            <div className="grid w-1/2 gap-3">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                placeholder="Satuan dari barang yang dibeli?"
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
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
