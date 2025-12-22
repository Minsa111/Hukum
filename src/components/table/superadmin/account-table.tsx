import * as React from "react";
import { Input } from "@/components/ui/input";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";

import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogActionDestructive,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { API_USERS } from "@/api/api";
import { fetchWithAuth } from "@/controllers/fetchwithauths";
import { toast } from "sonner";
import { AccountAddDialog } from "@/components/dialog/add-account-dialog";
import { AccountDetailDialog } from "@/components/dialog/detail-account-dialog";

function DraggableRow({ row }: { row: Row<User> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  report,
  onDataChange,
}: {
  report: User[];
  onDataChange?: () => void;
}) {


  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDetailAccount, setOpenDetailAccount] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<User | null>(
    null
  );

  /* ------------------------------- Table States ------------------------------- */
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  /* ----------------------------- Drag & Drop ----------------------------- */
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const sortableIds = React.useMemo<UniqueIdentifier[]>(
    () => report.map((item) => item.id),
    [report]
  );

  /* ------------------------------ Delete Action ------------------------------ */
  async function handleDelete() {
    try {
      await fetchWithAuth(`${API_USERS}/${selectedActivity!.id}`, {
        method: "DELETE",
      });

      toast.success("Data berhasil dihapus!");

      setOpenDeleteDialog(false);
      setSelectedActivity(null);
      onDataChange?.();
    } catch (err) {
      toast.error("Gagal menghapus data: " + err);
    }
  }

  /* --------------------------- Table Column Defs --------------------------- */
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="text-left truncate w-64 px-2"
        >
          <button className="text-left truncate hover:underline w-64 px-2"
            onClick={
              () => {
                setOpenDetailAccount(true)
                setSelectedActivity(row.original)
              }}>
            {row.original.username}
          </button>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="text-left truncate w-40 px-2">
          {row.original.role}
        </div>
      ),
    },
    {
      accessorKey: "Nama Sekolah",
      header: "Nama Sekolah",
      cell: ({ row }) => {
        const isAdmin = row.original.role === "admin"

        return (
          <div
            className={`text-left truncate w-40 px-2 ${isAdmin
                ? "text-muted-foreground italic cursor-not-allowed"
                : ""
              }`}
          >
            {isAdmin
              ? "-"
              : row.original.school?.school_name ?? "-"}
          </div>
        )
      },
    },

    {

      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="text-left truncate w-40 px-2">
          {row.original.status}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
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
                setOpenDetailAccount(true)
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
  ];

  /* ------------------------------- Table Instance ------------------------------ */
  const table = useReactTable({
    data: report,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  /* ------------------------------ Drag End ------------------------------ */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableIds.indexOf(active.id);
    const newIndex = sortableIds.indexOf(over.id);

    arrayMove(report, oldIndex, newIndex);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Tabs defaultValue="semua" className="w-full flex-col gap-4">
      {/* ---------------------------- Delete Dialog ---------------------------- */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun{" "}
              {selectedActivity?.username}?
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
      <AccountAddDialog open={openDialog} onOpenChange={setOpenDialog} onSuccess={onDataChange} />
      <AccountDetailDialog open={openDetailAccount} onOpenChange={setOpenDetailAccount} onSuccess={onDataChange} report={selectedActivity} />

      {/* ---------------------------- Search + Column Settings ---------------------------- */}
      <div className="w-full flex flex-col sm:flex-row items-start gap-2 justify-between px-4">
        <Input
          placeholder="Cari username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("username")?.setFilterValue(e.target.value)
          }
          className="text-sm max-w-sm"
        />
        <div className="flex items-center self-end gap-2">
          <Button type="button" variant="default" size="lg" onClick={() => setOpenDialog(true)}>
            <IconPlus />Tambah Akun
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <IconLayoutColumns />
                <span>Kolom</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(Boolean(v))}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* ------------------------------- TABLE ------------------------------- */}
      <TabsContent
        value="semua"
        className="relative flex flex-col gap-4 overflow-auto px-4"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-6 text-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  <SortableContext
                    items={sortableIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* ------------------------------ Pagination ------------------------------ */}
        <div className="flex items-center justify-between px-4">
          <div className="hidden lg:flex text-muted-foreground text-sm flex-1">
          </div>

          <div className="flex gap-8 items-center">
            <div className="hidden lg:flex items-center gap-2">
              <Label className="text-sm font-medium">Rows per page</Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20" size="sm">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex size-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronsLeft />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex size-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
