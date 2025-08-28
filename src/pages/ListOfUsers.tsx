import { useState } from "react";
import useFetchUsers, { type User } from "@/hooks/useFetchUsers";
import { format } from "date-fns";
import { USER_PER_PAGE } from "@/utils/constants";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";

type SortKey = "name" | "createdAt" | null;
type SortDirection = "asc" | "desc";

const ListOfUsers = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [specificUser, setSpecificUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { users } = useFetchUsers();

  const hanldeModalOpen = (user: User) => {
    setSpecificUser(user);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === "name") {
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }

    if (sortKey === "createdAt") {
      const aDate = aValue ? new Date(aValue) : null;
      const bDate = bValue ? new Date(bValue) : null;

      if (aDate && bDate) {
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      if (aDate) return sortDirection === "asc" ? -1 : 1;
      if (bDate) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }

    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USER_PER_PAGE);
  const start = (currentPage - 1) * USER_PER_PAGE;
  const end = start + USER_PER_PAGE;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">List of Users</h2>
      <Input
        placeholder="Search by name..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ArrowUpDown
                    className={`ml-2 h-4 w-4 ${
                      sortKey === "name"
                        ? sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                        : ""
                    }`}
                  />
                </Button>
              </TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At
                  <ArrowUpDown
                    className={`ml-2 h-4 w-4 ${
                      sortKey === "createdAt"
                        ? sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                        : ""
                    }`}
                  />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length ? (
              filteredUsers.slice(start, end).map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {start + index + 1}
                  </TableCell>
                  <TableCell>
                    {user.avatar ? (
                      <HoverCard>
                        <HoverCardTrigger>
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent side="right" className="w-auto p-2">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-36 w-36 rounded-full border object-cover shadow-md border-muted-foreground"
                          />
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <Dialog>
                    <TableCell>
                      <DialogTrigger
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => hanldeModalOpen(user)}
                      >
                        {user.name}
                      </DialogTrigger>
                    </TableCell>
                    <DialogContent className="w-[90vw] max-w-[425px] sm:max-w-lg overflow-y-auto">
                      <DialogHeader className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10 p-4 sm:p-6">
                        <div>
                          <img
                            src={specificUser?.avatar}
                            alt={specificUser?.name}
                            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border p-1 object-cover shadow-lg border-muted-foreground"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
                          <DialogTitle className="text-xl sm:text-2xl">
                            {specificUser?.name}
                          </DialogTitle>
                          <DialogDescription>
                            <div className="text-sm sm:text-base">
                              <p>
                                <span className="font-semibold">Gender:</span>{" "}
                                {specificUser?.gender}
                              </p>
                              <p>
                                <span className="font-semibold">Location:</span>{" "}
                                {specificUser?.location}
                              </p>
                              <p>
                                <span className="font-semibold">Age:</span>{" "}
                                {specificUser?.age}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Created At:
                                </span>{" "}
                                {specificUser?.createdAt
                                  ? format(specificUser?.createdAt, "PPP")
                                  : "N/A"}
                              </p>
                            </div>
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <TableCell>{user.gender || "N/A"}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>
                    {user.createdAt ? format(user?.createdAt, "PPP") : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={7}>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Ellipsis */}
          {totalPages > 7 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              className={`${
                currentPage === totalPages
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ListOfUsers;
