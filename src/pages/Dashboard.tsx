import useFetchUsers from "@/hooks/useFetchUsers";
import UserBarChart from "@/components/UserBarChart";
import UserPieChart from "@/components/UserPieChart";
import RecentJoinedUser from "@/components/RecentJoinedUser";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { users } = useFetchUsers();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Total Users: {users.length}</h2>
        <Link to="/users">
          <Button className="cursor-pointer">List of Users</Button>
        </Link>
      </div>
      <UserBarChart users={users} />
      <UserPieChart users={users} />
      <RecentJoinedUser users={users} />
    </div>
  );
};

export default Dashboard;
