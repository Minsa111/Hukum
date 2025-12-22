"use client"

import * as React from "react"
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

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogActionDestructive, AlertDialogCancel, AlertDialogTrigger, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_SCHOOLS } from "@/api/api"
import { SchoolDetailDialog } from "@/components/dialog/school-detail-dialog"


function DraggableRow({ row }: { row: Row<any> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id, // ✅ use nisn as row id
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

export function DataTable2({
  reports,
  onDataChange
}: {
  reports: any[]
  onDataChange?: () => void
}) {
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null)
  const [data, setData] = React.useState(reports)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [openSchoolDialog, setOpenSchoolDialog] = React.useState(false);
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  async function handleDelete() {
    try {
      await fetchWithAuth(`${API_SCHOOLS}/${selectedActivity.id}`, {
        method: "DELETE",
      });
      if (onDataChange) 
      onDataChange();
      setSelectedActivity(null);
      toast.success("Data berhasil dihapus!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Terjadi kesalahan saat menghapus data.");
    }
  }
  React.useEffect(() => {
  if (!reports) return;


}, [reports]);
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => item.id) || [],
    [data]
  )

  const columns: ColumnDef<{
    id: string
    nisn: string
    school_name: string
    created_at: string
    updated_at: string
    
  }>[] = [
    {
      accessorKey: "npns",
      header: "NPSN",
      cell: ({ row }) => (
        <div className="text-left truncate hover:underline w-32 px-2 lg:px-4 font-medium" 
        onClick={() =>{
          setSelectedActivity(row.original)
          setOpenSchoolDialog(true)}}>
            {row.original.nisn}
        </div>
      ),
    },
    {
      accessorKey: "school_name",
      header: "Sekolah",
      cell: ({ row }) => (
        <div className="text-left truncate hover:underline w-56 px-2 lg:px-4 font-medium"
        onClick={() =>{
          setSelectedActivity(row.original)
          setOpenSchoolDialog(true)}}>
            {row.original.school_name}
        </div>
      ),
    },
    {
      accessorKey: "Dibuat Pada",
      header: "Dibuat Pada",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4">
          {row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "terakhir diperbarui",
      header: "Terakhir Diperbarui",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4">
          {row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
        </div>
      ),
    },
    {
          id: "actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah anda yaking ingin menghapus {selectedActivity?.school_name}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogActionDestructive onClick={handleDelete}>Hapus</AlertDialogActionDestructive>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
                >
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedActivity(row.original)
                    setOpenSchoolDialog(true)
                  }}
                >Detail</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedActivity(row.original)
                    setOpenSchoolDialog(true)
                  }}
                >Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => {
                  setSelectedActivity(row.original)
                  setOpenDeleteDialog(true)
                }}
                >Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id, // ✅ uses nisn as the true ID
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
    <Tabs defaultValue="semua" className="w-full flex-col justify-start gap-6">
      <SchoolDetailDialog
        open={openSchoolDialog}
        onOpenChange={setOpenSchoolDialog}
        school={selectedActivity ?? {}}
        onSuccess={() => onDataChange?.()}
      />
      <TabsContent value="semua" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className="text-left px-4 lg:px-6"
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.original.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  )
}
