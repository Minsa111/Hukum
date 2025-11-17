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
import { z } from "zod"

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

// ✅ Draggable row — uses nisn as id
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

export function DataTable({
  reports,
  selectedYear,
  onDataChange,
}: {
  reports: any[]
  selectedYear: string
  onDataChange?: () => void
}) {
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [data, setData] = React.useState<
    {
      id: string
      school_name: string
      totalBudget: number
      totalRealization: number
      lastUpdated: string | null
    }[]
  >([])

  const [rowSelection, setRowSelection] = React.useState({})
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

  // ✅ Create summarized rows with nisn as ID
  React.useEffect(() => {
  if (!reports) return;

  try {
    const parsed = reportDataSchema.parse(reports);

    const summarized = parsed.map((school) => {
      let totalBudget = 0;
      let totalRealization = 0;
      let lastUpdated: string | null = null;

      school.reports.forEach((report) => {
        // Funding sources
        report.fundingSources.forEach((fund) => {
          const year = new Date(fund.received_date).getFullYear().toString();
          if (selectedYear === "Semua" || year === selectedYear) {
            totalBudget += parseFloat(fund.budget_amount);
          }
        });

        // Activities
        report.activities.forEach((act) => {
          const actYear = new Date(act.activityDate).getFullYear().toString();
          if (selectedYear === "Semua" || actYear === selectedYear) {
            totalRealization += parseFloat(act.unitPrice) * act.quantity;
          }

          const updatedTime = new Date(act.updated_at);
          if (!lastUpdated || updatedTime > new Date(lastUpdated)) {
            lastUpdated = act.updated_at;
          }
        });
      });

      return {
        id: school.nisn, // ✅ still using nisn as the unique identifier
        school_name: school.school_name,
        totalBudget,
        totalRealization,
        lastUpdated,
      };
    });

    setData(summarized);
    console.log("Data:", summarized);
  } catch (err) {
    console.error("Invalid data:", err);
    toast.error("Terjadi kesalahan saat memproses data. " + err);
  }
}, [reports, selectedYear]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => item.id) || [],
    [data]
  )

  const columns: ColumnDef<{
    nisn: string
    school_name: string
    totalBudget: number
    totalRealization: number
    lastUpdated: string | null
  }>[] = [
    {
      accessorKey: "school_name",
      header: "Sekolah",
      cell: ({ row }) => (
        <div className="text-left truncate hover:underline w-56 lg:w-xs px-2 lg:px-4 font-medium">
          <Link to={`/rekap/${row.original.id}`}>
            {row.original.school_name}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "totalBudget",
      header: "Total Dana Anggaran",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4">
          Rp {row.original.totalBudget.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "totalRealization",
      header: "Total Dana Terealisasi",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4">
          Rp {row.original.totalRealization.toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Terakhir Diperbarui",
      cell: ({ row }) => (
        <div className="text-left px-2 lg:px-4">
          {row.original.lastUpdated
            ? new Date(row.original.lastUpdated).toLocaleString("en-GB", {
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
      cell: ({ row }) => {
        return(
          <Button onClick={() => navigate(`/rekap/${row.original?.id}`)}>Detail</Button>
        )
      },
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
