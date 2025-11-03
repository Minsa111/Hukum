
import * as React from "react"
import { Link, useParams } from "react-router-dom"
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
  IconDotsVertical,
  IconLayoutColumns,
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
import { schema } from "@/models/schema/admin-reportactivity-table"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
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
  // TabsList,
  // TabsTrigger,
} from "@/components/ui/tabs"
import { ActivityDetailDialog } from "@/components/dialog/activity-detail-dialog"


  

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
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

export function DataTable({activities = []}: {activities: any[]}) {
  const [selectedActivity, setSelectedActivity] = React.useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [data, setData] = React.useState<z.infer<typeof schema>[]>([]);
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

const dataIds = React.useMemo<UniqueIdentifier[]>(
  () => data?.map((item) => item.id) || [],
  [data]
)

React.useEffect(() => {
  if (Array.isArray(activities)) {
    const normalized = activities.map((a) => ({
      ...a,
      activityDate: new Date(a.activityDate),
      created_at: new Date(a.created_at),
      updated_at: new Date(a.updated_at),
    }))
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    setData(normalized);
  }
}, [activities]);

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
    accessorKey: "Kegiatan",
    header: "Kegiatan",
    cell: ({ row }) => {
      return (
        <div className="text-left truncate w-64 lg:w-xs px-2 lg:px-4">
          <button
            onClick={() => {
              setSelectedActivity(row.original)
              console.log("lmaoxd", row.original)
              setIsDialogOpen(true)
            }}
            className="text-left truncate hover:underline"
          >
            {row.original.activity}
          </button>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "File Pendukung",
    header: "File Pendukung",
    cell: ({ row }) => {
      const hasFile = !!row.original.supportingFile; // true if file exists
      return (
        <div className="text-left w-32 px-2 lg:px-4">
          <span>
            {hasFile ? <Badge variant={"outline"}>Ada</Badge> : <Badge variant={"outline"}>Tidak ada</Badge>}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Tanggal Kegiatan",
    header: "Tanggal Kegiatan",
    cell: ({ row }) => {
      const date = new Date(row.original.activityDate);
      return (
        <div className="w-auto text-left px-2 lg:px-4">
          {date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },

  {
    accessorKey: "Rekening Belanja",
    header: "Rekening Belanja",
    cell: ({ row }) => (
      <div className="w-32 text-left px-2 lg:px-4">
        {row.original.spendingAccount}
      </div>
    ),
  },
  {
    accessorKey: "Uraian",
    header: "Uraian",
    cell: ({ row }) => (
      <div className="w-52 truncate text-left px-2 lg:px-4">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "Harga Satuan",
    header: "Harga Satuan",
    cell: ({ row }) => { 
      const unitPrice = parseInt(String(row.original.unitPrice), 10);
      return (
        <div className="w-32 text-left px-2 lg:px-4">
          Rp. {isNaN(unitPrice) ? "-" : unitPrice.toLocaleString("id-ID")}
        </div>
      );
    },
  },

  {
    accessorKey: "Kuantitas",
    header: "Kuantitas",
    cell: ({ row }) => (
      <div className="w-32 text-left px-2 lg:px-4">
        {row.original.quantity}
      </div>
    ),
  },
  {
    accessorKey: "Unit",
    header: "Unit",
    cell: ({ row }) => (
      <div className="w-32 text-left px-2 lg:px-4">
        {row.original.unit}
      </div>
    ),
  },

  {
    accessorKey: "Total Harga",
    header: "Total Harga",
    cell: ({ row }) => {
      const total = row.original.quantity * parseFloat(String(row.original.unitPrice));
      return (
        <div className="w-32 text-left px-2 lg:px-4">
          Rp. {total.toLocaleString("id-ID")}
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
        <div className="w-auto text-left  px-2 lg:px-4">
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
    accessorKey: "Terakhir Diperbarui",
    header: "Terakhir Diperbarui",
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at);
      return (
        <div className="w-auto px-2 text-left  lg:px-4">
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
      <DropdownMenu>
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
              setIsDialogOpen(true)
          }}
          >Detail</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
      className="w-full flex-col justify-start gap-6"
    >
      <ActivityDetailDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        activities={selectedActivity}
      />
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Input
          placeholder="Search by title..."
          value={(table.getColumn("Kegiatan")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Kegiatan")?.setFilterValue(event.target.value)
          }
          className="text-sm max-w-sm"
        />
        <div className=" flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Custom Kolom</span>
                  <span className="lg:hidden">Kolom</span>
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