// src/components/report-shop-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ChevronDownIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_URL, API_ACTIVITY, API_UPLOAD } from "@/api/api"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,   AlertDialogActionDestructive } from "../ui/alert-dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import * as React from "react"
import { toast } from "sonner"

export function ActivityDetailDialog({
  open,
  activities,
  onOpenChange,
  onSuccess,
}: {
  activities: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const [activityName, setActivityName] = React.useState(activities.activity ?? "")
  const [spendingAccount, setSpendingAccount] = React.useState(activities?.spendingAccount ?? "")
  const [price, setPrice] = React.useState(activities?.unit_price ?? "")
  const [quantity, setQuantity] = React.useState(activities?.quantity ?? "")
  const [unit, setUnit] = React.useState(activities?.unit ?? "")
  const [description, setDescription] = React.useState(activities?.description ?? "")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)


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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const isEditing = !!activities?.id
    const formData = new FormData()
    
    formData.append("activity", activityName|| "")
    formData.append("activity_date", date ? date.toISOString().split("T")[0] : "")
    formData.append("spending_account", spendingAccount)
    formData.append("description", description)
    formData.append("unit_price", price.replace(/\D/g, ""))
    formData.append("quantity", quantity)
    formData.append("unit", unit)
    if (file) formData.append("supporting_file", file)

    const method = isEditing ? "PUT" : "POST"
    const url = isEditing
      ? `${API_URL}${API_ACTIVITY}/${activities.id}`
      : `${API_ACTIVITY}`

    const res = await fetchWithAuth(url, { method, body: formData })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    toast.success(isEditing ? "Laporan berhasil diperbarui!" : "Laporan berhasil ditambahkan!")
    onOpenChange(false)
    onSuccess?.()
  } catch (err) {
    console.error(err)
    toast.error("Gagal menyimpan data.")
  } finally {
    setLoading(false)
  }
}

const handleDelete = async () => {
  if (!activities?.id) {
    console.error("ID not found")
    return toast.error("ID tidak ditemukan.")
  }

  try {
    setLoading(true)
    await fetchWithAuth(`${API_ACTIVITY}/${activities.id}`, { method: "DELETE" })
    toast.success("Data berhasil dihapus!")
    onOpenChange(false)
    onSuccess?.()
  } catch (err) {
    console.error("Delete error:", err)
    toast.error("Terjadi kesalahan saat menghapus data.")
  } finally {
    setLoading(false)
  }

}


React.useEffect(() => {
  if (activities) {
    setActivityName(activities.activity || "")
    setDescription(activities.description || "")
    setPrice(
      activities.unitPrice
        ? Number(activities.unitPrice).toLocaleString("id-ID")
        : ""
    )
    setQuantity(activities.quantity || "")
    setUnit(activities.unit || "")
    setDate(
      activities.activityDate ? new Date(activities.activityDate) : undefined
    )
  }
}, [activities])

return (
  <Dialog
    open={open}
    onOpenChange={(value) => {
      if (!value) {
        // 🧠 Reset edit mode and form state when dialog closes
        setIsEditing(false)
        setDescription(activities?.description || "")
        setPrice(
          activities?.unitPrice
            ? Number(activities.unitPrice).toLocaleString("id-ID")
            : ""
        )
        setQuantity(activities?.quantity || "")
        setUnit(activities?.unit || "")
        setDate(
          activities?.activityDate ? new Date(activities.activityDate) : undefined
        )
        setFile(null)
      }
      onOpenChange(value)
    }}
  >
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Detail Kegiatan</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-5 py-1">
        {/* Editable state toggle */}
        <div className="grid gap-2 ">
          <Label htmlFor="activity" ><span className="text-neutral-500">Kegiatan</span></Label>
          {isEditing ? (
            <Input
              id="activity"
              value={activityName || ""}
              onChange={(e) => setActivityName(e.target.value)}
            />
          ) : (
            <span >{activities?.activity || ""}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date"><span className="text-neutral-500">Tanggal Kegiatan</span></Label>
          {isEditing ? (
            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="justify-between">
                  {date
                    ? date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Pilih tanggal"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setOpenDate(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <span>
              {activities?.activityDate
                ? new Date(activities.activityDate).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-[260px] break-words whitespace-normal">
          <Label htmlFor="spendingAccount"><span className="text-neutral-500">Rekening Belanja</span></Label>
          {isEditing ? (
            <Input
              id="spendingAccount"
              value={spendingAccount || ""}
              onChange={(e) => setSpendingAccount(e.target.value)}
            />
          ) : (
            <p className="break-words whitespace-normal">{activities?.spendingAccount || ""}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="file" > <span className="text-neutral-500">File Pendukung</span></Label>
          {isEditing ? (
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          ) : (
            <div className="flex gap-4">
              <span>{activities?.supportingFile || "File tidak ditemukan"}</span>
              {activities?.supportingFile && (
                <Button
                  type="button" 
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `${API_URL}${API_UPLOAD}/${activities.supportingFile}`,
                      "_blank"
                    )
                  }
                >
                  Lihat File
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-start">
          <div className="flex flex-col gap-2 flex-1 min-w-[260px] break-words whitespace-normal">
            <Label htmlFor="description"> <span className="text-neutral-500">Uraian</span></Label>
            {isEditing ? (
              <Input
                id="description"
                value={description || ""}
                onChange={(e) =>setDescription(e.target.value)
                }
              />
            ) : (
              <p className=" text-gray-700 break-words">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-[260px] gap-2 ">
            <Label htmlFor="price"><span className="text-neutral-500">Harga Satuan</span></Label>
            {isEditing ? (
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>Rp.</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="price"
                  placeholder="Masukkan harga"
                  className="!pl-1"
                  value={price}
                  onChange={handleChange}
                />
              </InputGroup>
            ) : (
              <p className="text-gray-700">
                Rp. {Number(activities?.unitPrice).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-start justify-between gap-3">
          <div className="grid w-1/2 gap-2">
            <Label htmlFor="quantity"><span className="text-neutral-500">Jumlah</span></Label>
            {isEditing ? (
              <Input
                id="quantity"
                value={quantity}
                onChange={handleNumber}
                placeholder="Masukkan jumlah"
              />
            ) : (
              <p>{quantity || ""}</p>
            )}
          </div>

          <div className="grid w-1/2 gap-2">
            <Label htmlFor="unit"><span className="text-neutral-500">Unit</span></Label>
            {isEditing ? (
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Masukkan unit"
              />
            ) : (
              <p>{unit || ""}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {!isEditing ? (
            <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                  variant="destructive"
                  type="button"
                > Hapus </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah anda yakin ingin menghapus data laporan ini, aksi ini tidak dapat dibatalkan
                    </AlertDialogDescription>
                  </AlertDialogHeader>  
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogActionDestructive onClick={handleDelete}>Lanjutkan</AlertDialogActionDestructive>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button
                type="button"
                variant="default"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Kembali
            </Button>
          </DialogClose>
            </>
            
          ) : (
          <>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
            <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
              Kembali
            </Button>
          </>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)
}
