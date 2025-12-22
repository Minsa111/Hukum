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
import { API_PURCHASE } from "@/api/api"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import { ScrollArea } from "../ui/scroll-area"
import * as React from "react"
import { toast } from "sonner"
import { IconCircleMinus, IconPlus } from "@tabler/icons-react"
import { AlertDialog, AlertDialogActionDestructive, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"

export function EditFundDialog({
  open,
  onOpenChange,
  onSuccess,
  report,
  isSuperAdmin
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  report: any
  isSuperAdmin?: boolean
}) {
  const [funds, setFunds] = React.useState([
    {
      id: "",
      source_of_fund: "",
      budget_amount: "",
      received_date: undefined as Date | undefined,
      openDate: false,
    },
  ])
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [selectedFund, setSelectedFund] = React.useState<any | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = React.useState(false)
  const [loading, setLoading] = React.useState(false)


  const addFund = () => {
    setFunds(prev => [
      ...prev,
      {
        id: "",
        source_of_fund: "",
        budget_amount: "",
        received_date: undefined,
        openDate: false,
      },
    ])
  }
  const updateFund = (index: number, key: string, value: any) => {
    setFunds(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: value }
      return updated
    })
  }
  const removeFund = (index: number) => {
    setFunds(prev => prev.filter((_, i) => i !== index))
  }
  const deleteFund = async (id: string) => {
    await fetchWithAuth(
      `${API_PURCHASE}/${report.id}/funding-sources/${id}`,
      { method: "DELETE" }
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      for (const f of funds) {
        if (!f.source_of_fund || !f.budget_amount || !f.received_date) {
          toast.error("Semua field wajib diisi.")
          setLoading(false)
          return
        }
      }

      // -----------------------------
      // 1️⃣ POST new funding sources
      // -----------------------------
      const newFunds = funds.filter(f => !f.id)

      if (newFunds.length > 0) {
        await fetchWithAuth(
          `${API_PURCHASE}/${report.id}/funding-sources`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              funding_sources: newFunds.map(f => ({
                source_of_fund: f.source_of_fund,
                budget_amount: parseInt(f.budget_amount.replace(/\D/g, "")),
                received_date: f.received_date.toLocaleDateString("sv-SE"),
              })),
            }),
          }
        )
      }

      // -----------------------------
      // 2️⃣ PUT existing funding sources
      // -----------------------------
      const existingFunds = funds.filter(f => f.id)

      for (const f of existingFunds) {
        await fetchWithAuth(
          `${API_PURCHASE}/${report.id}/funding-sources/${f.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source_of_fund: f.source_of_fund,
              budget_amount: parseInt(f.budget_amount.replace(/\D/g, "")),
              received_date: f.received_date.toLocaleDateString("sv-SE"),
            }),
          }
        )
      }

      toast.success("Sumber dana berhasil disimpan!")
      onOpenChange(false)
      onSuccess?.()

    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan sumber dana.")
    } finally {
      setLoading(false)
    }
  }


  React.useEffect(() => {
    if (open && report?.fundingSources) {
      const mapped = report.fundingSources.map((f: any) => ({
        id: f.id,
        source_of_fund: f.source_of_fund || "",
        budget_amount: Number(f.budget_amount).toLocaleString("id-ID"),
        received_date: f.received_date ? new Date(f.received_date) : undefined,
        openDate: false,
      }))

      setFunds(mapped.length > 0 ? mapped : [{
        id: undefined,
        source_of_fund: "",
        budget_amount: "",
        received_date: undefined,
        openDate: false,
      }])
    }
  }, [open, report])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apaka anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus anggaran {selectedFund?.source_of_fund}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogActionDestructive
              onClick={async () => {
                if (selectedFund?.id) {
                  try {
                    await deleteFund(selectedFund?.id)
                    toast.success("Data berhasil dihapus!")
                    setSelectedFund(null)
                    setOpenDeleteDialog(false)
                    removeFund(funds.indexOf(selectedFund))
                  } catch (err) {
                    console.error(err)
                    toast.error("Terjadi kesalahan saat menghapus data.")
                  }
                }
              }}>Lanjutkan</AlertDialogActionDestructive>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogContent className="sm:max-w-[425px]">

        <DialogHeader>
          <DialogTitle>Sumber Dana</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">

          {/* SCROLLABLE SECTION */}
          <ScrollArea className="min-h-64 max-h-84 sm:max-h-100 pr-2">
            <div className="flex flex-col gap-4">
              {funds.map((fund, index) => (
                <div key={index} className="border rounded-md p-4 relative">

                  {/* REMOVE BUTTON */}
                  {funds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFund(fund)
                        setOpenDeleteDialog(true)
                      }
                      }
                      className="absolute right-2 top-2 text-red-500"
                    >
                      <IconCircleMinus />
                    </button>
                  )}

                  {/* SOURCE OF FUND */}
                  <div className="grid gap-3 mt-3">
                    <Label>Sumber Dana</Label>
                    <Input
                      required
                      value={fund.source_of_fund}
                      disabled={isSuperAdmin === true}
                      onChange={(e) =>
                        updateFund(index, "source_of_fund", e.target.value)
                      }
                    />
                  </div>

                  {/* DATE */}
                  <div className="flex flex-col gap-3 mt-3">
                    <Label>Tanggal Dana Diterima</Label>

                    <Input
                      type="date"
                      required
                      value={
                        fund.received_date
                          ? fund.received_date.toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        updateFund(
                          index,
                          "received_date",
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      disabled={isSuperAdmin === true}
                    />
                  </div>



                  {/* BUDGET */}
                  <div className="grid gap-3 mt-3">
                    <Label>Jumlah Nominal</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>Rp.</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        required
                        placeholder="1.000.000"
                        value={fund.budget_amount}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "")
                          const formatted = raw
                            ? Number(raw).toLocaleString("id-ID")
                            : ""
                          updateFund(index, "budget_amount", formatted)
                        }}
                      />
                    </InputGroup>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* ADD FUND BUTTON */}
          <Button
            type="button"
            variant="outline"
            className="flex gap-2 justify-center"
            onClick={addFund}
          >
            <IconPlus className="w-4 h-4" />
            Tambah Sumber Dana
          </Button>

          {/* FOOTER */}
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
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  )
}
