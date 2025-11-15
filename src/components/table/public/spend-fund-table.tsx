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
import { reportDataSchema } from "@/models/schema/public-dashboard-table"

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
import { ActivityDetailDialog } from "@/components/dialog/activity-detail-dialog"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import z from "zod"

function DraggableRow({ row }: { row: Row<any> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.nisn,
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
  reports,
  selectedYear,
  onDataChange,
}: {
  reports: any[]
  selectedYear: string
  onDataChange?: () => void
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [data, setData] = React.useState<
    {
      nisn: string
      school_name: string
      totalBudget: number
      totalRealization: number
      lastUpdated: string | null
    }[]
  >([])

  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const navigate = useNavigate()

React.useEffect(() => {
  if (!reports || reports.length === 0) return;

  try {
    console.log("📌 incoming reports:", reports);

    // Each report entry has its own fundingSources + activities
    const normalizedRows: any[] = [];

    reports.forEach((reportEntry) => {
      const fundingMap = {};

      // Prepare budget per funding source
      reportEntry.fundingSources?.forEach((fund) => {
        const fundYear = new Date(fund.received_date).getFullYear().toString();
        if (selectedYear !== "Semua" && fundYear !== selectedYear) return;

        fundingMap[fund.source] = (fundingMap[fund.source] || 0) + Number(fund.budget_amount);
      });

      // Prepare activities
      reportEntry.activities?.forEach((act) => {
        const actYear = new Date(act.activityDate).getFullYear().toString();
        if (selectedYear !== "Semua" && actYear !== selectedYear) return;

        const realization = Number(act.unitPrice) * Number(act.quantity);
        const updatedTime = act.updated_at ? new Date(act.updated_at) : null;

        normalizedRows.push({
          id: act.id,                               // unique row id
          title: act.title || "Kegiatan Tanpa Nama",
          source: act.sourceOfFund || "-",          // you may adjust based on real model
          totalBudget: fundingMap[act.sourceOfFund] || 0,
          totalRealization: realization,
          lastUpdated: updatedTime ? updatedTime.toISOString() : null,
        });
      });
    });

    setData(normalizedRows);
  } catch (err) {
    console.error("❌ Data table parsing error:", err);
    toast.error("Terjadi kesalahan saat memproses data tabel.");
  }
}, [reports, selectedYear]);



  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => item.nisn) || [],
    [data]
  )

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Nama Laporan",
      cell: ({ row }) => (
        <div className="text-left truncate w-56 px-4 font-medium">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "totalBudget",
      header: "Total Anggaran",
      cell: ({ row }) => (
        <div className="text-left px-4">
          Rp {row.original.totalBudget.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "totalRealization",
      header: "Total Realisasi",
      cell: ({ row }) => (
        <div className="text-left px-4">
          Rp {row.original.totalRealization.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Terakhir Diperbarui",
      cell: ({ row }) => (
        <div className="text-left px-4">
          {row.original.lastUpdated
            ? new Date(row.original.lastUpdated).toLocaleString("id-ID")
            : "-"}
        </div>
      ),
    },
  ]


  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id, 
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
      <ActivityDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        activities={selectedActivity ?? {}}
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
                    {
                      table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.original.id} row={row} />
                      ))
                    }
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
