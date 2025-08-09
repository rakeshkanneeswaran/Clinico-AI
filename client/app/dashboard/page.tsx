"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  MoreHorizontal,
  ArrowRight,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessions, deleteSession } from "./action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

declare module "@tanstack/table-core" {
  interface FilterFns {
    customFilter: FilterFn<unknown>;
  }
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<
    {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      patient: {
        id: string;
        name: string;
        age: string;
        weight: string;
        height: string;
        bloodType: string;
        gender: string;
      } | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setLoading(true);
    getSessions(userId)
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      });
  };

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      const result = await deleteSession(sessionToDelete);
      if (result.success) {
        toast.success("Session deleted successfully");
        fetchSessions();
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("An error occurred while deleting the session");
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "patient.name",
      header: "Patient Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.patient?.name || "Unnamed Patient"}
        </div>
      ),
    },
    {
      accessorKey: "patient.age",
      header: "Age",
      cell: ({ row }) => <div>{row.original.patient?.age || "N/A"}</div>,
    },
    {
      accessorKey: "patient.gender",
      header: "Gender",
      cell: ({ row }) => <div>{row.original.patient?.gender || "N/A"}</div>,
    },
    {
      accessorKey: "patient.bloodType",
      header: "Blood Type",
      cell: ({ row }) => <div>{row.original.patient?.bloodType || "N/A"}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-10 w-10 p-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56" // Increased width
            >
              <DropdownMenuLabel className="px-4 py-2 text-sm font-medium">
                {" "}
                {/* Added padding */}
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" /> {/* Added margin */}
              <DropdownMenuItem
                className="px-4 py-2 text-sm" // Added padding and text size
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(row.original.id);
                  toast.success("Session ID copied to clipboard");
                }}
              >
                <FileText className="mr-3 h-4 w-4" />{" "}
                {/* Increased icon spacing */}
                Copy Session ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-2 text-sm" // Added padding and text size
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/session?session=${row.original.id}`);
                }}
              >
                <ArrowRight className="mr-3 h-4 w-4" />{" "}
                {/* Increased icon spacing */}
                View Session
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" /> {/* Added margin */}
              <DropdownMenuItem
                className="px-4 py-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50" // Enhanced styling
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.original.id);
                }}
              >
                <Trash2 className="mr-3 h-4 w-4" />{" "}
                {/* Increased icon spacing */}
                Delete Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: sessions,
    columns,
    filterFns: {
      customFilter: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)?.toString().toLowerCase() || "";
        return value.includes(filterValue.toLowerCase());
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Patient Sessions
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 w-[300px]"
            />
            {globalFilter && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setGlobalFilter("")}
              />
            )}
          </div>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/session?session=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {sessions.length}{" "}
          sessions
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              session and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
