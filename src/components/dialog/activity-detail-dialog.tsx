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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogActionDestructive,
} from "../ui/alert-dialog"
import * as React from "react"
import { toast } from "sonner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"

export function ActivityDetailDialog({
  open,
  activities,
  onOpenChange,
  onSuccess,
  isEdit,
  onEdit,
  onCancelEdit,
  isPublics,
}: {
  activities: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  isEdit?: boolean
  onEdit?: () => void
  onCancelEdit?: () => void
  isPublics?: boolean
}) {
  // ----- MAIN CONTROLS -----
  const [loading, setLoading] = React.useState(false)

  // ----- FORM FIELDS -----
  const [activityName, setActivityName] = React.useState("")
  const [spendingAccount, setSpendingAccount] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [quantity, setQuantity] = React.useState("")
  const [unit, setUnit] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>()
  const [file, setFile] = React.useState<File | null>(null)
  const [openDate, setOpenDate] = React.useState(false)

  // ----- UTILITY: PRICE FORMAT -----
  const formatPrice = (val: string | number) => {
    if (!val) return ""
    return Number(val).toLocaleString("id-ID")
  }

  // ----- RESET FORM -----
  const resetForm = React.useCallback(() => {
    setActivityName(activities?.activity || "")
    setSpendingAccount(activities?.spendingAccount || "")
    setPrice(formatPrice(activities?.unitPrice))
    setQuantity(activities?.quantity?.toString() || "")
    setUnit(activities?.unit || "")
    setDescription(activities?.description || "")
    setDate(
      activities?.activityDate ? new Date(activities.activityDate) : undefined
    )
    setFile(null)
  }, [activities])

  // ----- SYNC WHEN OPENED -----
  React.useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open, activities, isEdit, resetForm])



  // ----- PRICE HANDLER -----
  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    setPrice(raw ? Number(raw).toLocaleString("id-ID") : "")
  }

  // ----- QUANTITY -----
  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    setQuantity(raw)
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.")
      e.target.value = "" // reset the input
      return
    }
    setFile(selectedFile || null)
  }
  // ----- SUBMIT -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("activity", activityName)
      formData.append("activity_date", date ? date.toISOString().split("T")[0] : "")
      formData.append("spending_account", spendingAccount)
      formData.append("description", description)
      formData.append("unit_price", price.replace(/\D/g, ""))
      formData.append("quantity", quantity)
      formData.append("unit", unit)
      if (file) {
        formData.append("supporting_file", file)
      } else {
        formData.append(
          "supporting_file",
          activities.supportingFile || ""
        )
      }

      // ⛔ POST removed - this dialog only updates existing data
      const method = "PUT"
      const url = `${API_ACTIVITY}/${activities.id}`
      await fetchWithAuth(url, { method, body: formData })
      toast.success("Berhasil diperbarui!")
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  // ----- DELETE -----
  const handleDelete = async () => {
    if (!activities?.id) return toast.error("ID tidak ditemukan.")

    try {
      setLoading(true)
      await fetchWithAuth(`${API_ACTIVITY}/${activities.id}`, { method: "DELETE" })
      toast.success("Data berhasil dihapus!")
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Gagal menghapus data.")
    } finally {
      setLoading(false)
    }
  }

  // =======================================================================
  //                                RENDER
  // =======================================================================

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          resetForm()
        }
        onOpenChange(value)
      }}
    >
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detail Kegiatan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-1">

          {/* ACTIVITY NAME */}
          <div className="grid gap-2">
            <Label className="text-neutral-500">Kegiatan</Label>
            {isEdit ? (
              <Input
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
            ) : (
              <span>{activityName}</span>
            )}
          </div>

          {/* DATE */}
          <div className="grid gap-2">
            <Label className="text-neutral-500">Tanggal Kegiatan</Label>
            {isEdit ? (
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between">
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
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d)
                      setOpenDate(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <span>
                {date
                  ? date.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
            )}
          </div>

          {/* SPENDING ACCOUNT */}
          <div className="grid gap-2">
            <Label className="text-neutral-500">Rekening Belanja</Label>
            {isEdit ? (
              <Input
                value={spendingAccount}
                onChange={(e) => setSpendingAccount(e.target.value)}
              />
            ) : (
              <span>{spendingAccount}</span>
            )}
          </div>

          {/* SUPPORTING FILE */}
          <div className="grid gap-2">
            <Label className="text-neutral-500">File Pendukung</Label>
          {!isEdit ? (
              <div className="flex gap-8">
                <span>{activities?.supportingFile || "Tidak ada file"}</span>
                {activities?.supportingFile && (
                  <Button
                    variant="outline"
                    type="button"
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
          ) :(
            <Input 
            id="file" 
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            />)}
          </div>

          {/* DESCRIPTION + PRICE */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 grid gap-2">
              <Label className="text-neutral-500">Uraian</Label>
              {isEdit ? (
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <span>{description}</span>
              )}
            </div>

            <div className="flex-1 grid gap-2">
              <Label className="text-neutral-500">Harga Satuan</Label>
              {isEdit ? (
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>Rp.</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput value={price} onChange={handlePriceInput} />
                </InputGroup>
              ) : (
                <span>Rp. {price}</span>
              )}
            </div>
          </div>

          {/* QUANTITY + UNIT */}
          <div className="flex gap-3">
            <div className="w-1/2 grid gap-2">
              <Label className="text-neutral-500">Jumlah</Label>
              {isEdit ? (
                <Input value={quantity} onChange={handleNumber} />
              ) : (
                <span>{quantity}</span>
              )}
            </div>

            <div className="w-1/2 grid gap-2">
              <Label className="text-neutral-500">Unit</Label>
              {isEdit ? (
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
              ) : (
                <span>{unit}</span>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex justify-between">

            {!isEdit ? (
              <>
              {!isPublics ? (
                <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogActionDestructive onClick={handleDelete}>
                        Hapus
                      </AlertDialogActionDestructive>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* EDIT */}
                <Button type="button" onClick={() => onEdit?.()}>
                  Edit
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Kembali
                  </Button>
                </DialogClose>
                </>
                ) : (
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Kembali
                  </Button>
                </DialogClose>
                )}
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCancelEdit?.()
                    resetForm()
                  }}
                >
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
