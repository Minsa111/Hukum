
import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconDotsVertical,
  IconLayoutColumns,
  // IconCircleCheckFilled,
  // IconGripVertical,
  // IconSearch,
  // IconLoader,
  // IconTrendingUp,
} from "@tabler/icons-react"
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,

  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"
import { reportSchema, schoolReportSchema } from "@/models/schema/public-dashboard-table"

// import { toast } from "sonner"
import { z } from "zod"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { ReportShopDialog } from "@/components/dialog/shop-report-add-dialog"
import { API_PURCHASE } from "@/api/api"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { AlertDialog,  AlertDialogCancel, AlertDialogContent, AlertDialogActionDestructive, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { EditReportShopEdDialog } from "@/components/dialog/shop-report-edit-dialog"




function DraggableRow({ row }: { row: Row<z.infer<typeof reportSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  report, 
  selectedYear,
  onDataChange,
}: {
  report: z.infer<typeof schoolReportSchema>[],
  selectedYear: string
  onDataChange?: () => void
}) {
  const [data, setData] = React.useState<z.infer<typeof reportSchema>[]>([])
  const [openDialog, setOpenDialog] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [openDialogEditReport, setOpenDialogEditReport] = React.useState(false)
  const navigate = useNavigate()

React.useEffect(() => {
  if (report) {
    const flattened = report.flatMap((school) =>
      school.reports.map((rep) => ({
        ...rep,
        school_name: school.school_name,
      }))
    );

    const sorted = flattened.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setData(sorted);
  }
}, [report]);



  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )


  async function handleDelete() {
    try {
      await fetchWithAuth(`${API_PURCHASE}/${selectedActivity.id}`, {
        method: "DELETE",
      });
      if (onDataChange) onDataChange();
      setOpenDeleteDialog(false);
      setSelectedActivity(null);
      toast.success("Data berhasil dihapus!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Terjadi kesalahan saat menghapus data.");
    }
  }

  const columns: ColumnDef<z.infer<typeof reportSchema>>[] = [
    {
      accessorKey: "title",
      header: "Laporan Pembelanjaan",
      cell: ({ row }) => {
        return (
          <div className="text-left truncate w-64 lg:w-xs px-2 lg:px-4">
            <Link
              to={`/superadmin/pembelanjaan/${row.original.id}`}
            >
              {row.original.title}
            </Link>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "Nama Sekolah",
      header: "Nama Sekolah",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4 w-40 truncate">
          {row.original.school_name}
        </div>
      ),
    },
    {
      accessorKey: "Sumber Dana",
      header: "Sumber Dana",
      cell: ({ row }) => {
        const sources = row.original.fundingSources?.map(f => f.source_of_fund).join(", ") || "-";
        return (
          <div className="text-left truncate w-32 px-2 lg:px-4">
            {sources}
          </div>
        );
      },
    },
    {
      accessorKey: "Total Dana Anggaran",
      header: "Total Dana Anggaran",
      cell: ({ row }) => (
        <div className="w-32 text-left px-2 lg:px-4">
          Rp. {(row.original.total_budget_amount??0).toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "Jumlah Realisasi",
      header: "Jumlah Realisasi",
      cell: ({ row }) => (
        <div className="w-32 text-left px-2 lg:px-4">
          Rp. {row.original.realization_amount.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "Sisa Dana Anggaran",
      header: "Sisa Dana Anggaran",
      cell: ({ row }) => (
        <div className="w-32 text-left px-2 lg:px-4">
          Rp. {row.original.remaining_fund.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "Terakhir Diperbarui",
      header: "Terakhir Diperbarui",
      cell: ({ row }) => {
        const date = new Date(row.original.updated_at);
        return (
          <div className="w-auto text-left px-2 lg:px-4">
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "Dibuat Pada",
      header: "Dibuat Pada",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <div className="w-auto text-left px-2 lg:px-4">
            {date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({row}) => (
        <Button onClick={() => navigate(`/superadmin/pembelanjaan/${row.original.id}`)}>Detail</Button>
      ),
    },
  ]
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (

    <Tabs
      defaultValue="semua"
      className="w-full flex-col justify-start gap-4"
    >
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apaka anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus laporan {selectedActivity?.title}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogActionDestructive onClick={handleDelete}>Lanjutkan</AlertDialogActionDestructive>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ReportShopDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSuccess={onDataChange}
      />
      <EditReportShopEdDialog   
        open={openDialogEditReport}
        onOpenChange={setOpenDialogEditReport}
        report={selectedActivity}
        onSuccess={onDataChange}
      />
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between px-4 lg:px-6">
        <Input
          placeholder="Pencarian Laporan..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="text-sm max-w-sm"
        />
        <div className="flex items-center self-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Custom Kolom</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="semua"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="text-left bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className="text-left px-4 lg:px-6" key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8 ">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
