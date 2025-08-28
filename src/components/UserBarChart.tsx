import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/hooks/useFetchUsers";

interface UserBarChartProps {
  users: User[];
}

const chartConfig = {
  users: {
    label: "Users",
    color: "#8884d8",
  },
} satisfies ChartConfig;

const UserBarChart = ({ users }: UserBarChartProps) => {
  const usersPerDay = useMemo(() => {
    const today = new Date();
    const last50Days = new Date(today);
    last50Days.setDate(today.getDate() - 50);

    const filteredUsers = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= last50Days && createdAt <= today;
    });

    const counts: { [key: string]: number } = {};
    for (let i = 0; i < 50; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      counts[formattedDate] = 0;
    }

    filteredUsers.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      const formattedDate = createdAt.toISOString().split("T")[0];
      if (counts[formattedDate] !== undefined) {
        counts[formattedDate]++;
      }
    });

    return Object.keys(counts)
      .map((date) => ({
        date,
        users: counts[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [users]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Created Per Day (Last 50 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={usersPerDay}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(136, 132, 216, 0.2)" }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UserBarChart;
