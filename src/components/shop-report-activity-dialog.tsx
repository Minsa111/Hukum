import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, } from "./ui/input-group"
import * as React from "react"
export function ReportShopActivityDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [value, setValue] = React.useState("")
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onOpenChange(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formatted = rawValue ? Number(rawValue).toLocaleString("id-ID") : ""
    setValue(formatted)
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
            <Label htmlFor="title">Judul</Label>
            <Input id="name" name="name" placeholder="Masukkan Judul" />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundsource">Sumber Dana</Label>
            <Input id="name" name="name" placeholder="Masukkan Sumber Dana" />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fundcurr">Jumlah Nominal</Label>
            <InputGroup>
              <InputGroupInput 
              id="fundcurr"
              placeholder="1.000.000" 
              className="!pl-1" 
              value={value}
              onChange={handleChange}
              />
              <InputGroupAddon>
                <InputGroupText>Rp. </InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
              </InputGroupAddon>
            </InputGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Tambah</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
