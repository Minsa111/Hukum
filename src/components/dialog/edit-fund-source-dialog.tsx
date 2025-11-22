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
import { ScrollArea } from "../ui/scroll-area"
import * as React from "react"
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import { IconCircleMinus, IconCirclePlus, IconPlus } from "@tabler/icons-react"
import { id } from "date-fns/locale"

export function EditFundDialog({
  open,
  onOpenChange,
  onSuccess,
  report,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  report: any
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
  const [value, setValue] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [openDate, setOpenDate] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formatted = rawValue ? Number(rawValue).toLocaleString("id-ID") : ""
    setValue(formatted)
  }

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
                      onClick={() => removeFund(index)}
                      className="absolute right-2 top-2 text-red-500"
                    >
                      <IconCircleMinus />
                    </button>
                  )}

                  {/* SOURCE OF FUND */}
                  <div className="grid gap-3 mt-3">
                    <Label>Sumber Dana</Label>
                    <Input
                      value={fund.source_of_fund}
                      onChange={(e) =>
                        updateFund(index, "source_of_fund", e.target.value)
                      }
                    />
                  </div>

                  {/* DATE */}
                  <div className="flex flex-col gap-3 mt-3">
                    <Label>Tanggal Dana Diterima</Label>
                    <Popover
                      open={fund.openDate}
                      onOpenChange={(open) => updateFund(index, "openDate", open)}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between">
                          {fund.received_date
                            ? fund.received_date.toLocaleDateString()
                            : "Pilih Tanggal"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={fund.received_date}
                          onSelect={(d) => {
                            updateFund(index, "received_date", d)
                            updateFund(index, "openDate", false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* BUDGET */}
                  <div className="grid gap-3 mt-3">
                    <Label>Jumlah Nominal</Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>Rp.</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
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
