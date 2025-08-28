import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  avatar: string;
  name: string;
  gender: string;
  age: number;
  location: string;
  createdAt: string;
}

const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("");
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
