import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { User } from "@/hooks/useFetchUsers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RecentJoinedUserProps {
  users: User[];
}

const RecentJoinedUser = ({ users }: RecentJoinedUserProps) => {
  const [specificUser, setSpecificUser] = useState<User | null>(null);

  const recentlyJoinedUsers = useMemo(() => {
    return users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [users]);

  const hanldeModalOpen = (user: User) => {
    setSpecificUser(user);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Joined Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of top 5 recently joined users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr. No</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentlyJoinedUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
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
                              {specificUser?.gender || "N/A"}
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
                              <span className="font-semibold">Created At:</span>{" "}
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
                <TableCell>{format(user.createdAt, "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentJoinedUser;
