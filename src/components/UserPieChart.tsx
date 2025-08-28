import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/hooks/useFetchUsers";

interface UserPieChartProps {
  users: User[];
}

const chartConfig = {
  withAvatar: {
    label: "With Avatar",
    color: "#82ca9d",
  },
  noAvatar: {
    label: "No Avatar",
    color: "#8884d8",
  },
  morning: {
    label: "Morning",
    color: "#FFBB28",
  },
  afternoon: {
    label: "Afternoon",
    color: "#00C49F",
  },
  evening: {
    label: "Evening",
    color: "#FF8042",
  },
  night: {
    label: "Night",
    color: "#8884d8",
  },
} satisfies ChartConfig;

const UserPieChart = ({ users }: UserPieChartProps) => {
  const avatarDistribution = useMemo(() => {
    const withAvatar = users.filter(
      (user) => user.avatar && user.avatar !== ""
    ).length;
    const noAvatar = users.length - withAvatar;

    return [
      {
        name: "withAvatar",
        value: withAvatar,
        fill: chartConfig.withAvatar.color,
      },
      { name: "noAvatar", value: noAvatar, fill: chartConfig.noAvatar.color },
    ];
  }, [users]);

  const timeOfDayDistribution = useMemo(() => {
    const morning = users.filter((user) => {
      const hour = new Date(user.createdAt).getHours();
      return hour >= 5 && hour < 12;
    }).length;

    const afternoon = users.filter((user) => {
      const hour = new Date(user.createdAt).getHours();
      return hour >= 12 && hour < 17;
    }).length;

    const evening = users.filter((user) => {
      const hour = new Date(user.createdAt).getHours();
      return hour >= 17 && hour < 21;
    }).length;

    const night = users.filter((user) => {
      const hour = new Date(user.createdAt).getHours();
      return hour >= 21 || hour < 5;
    }).length;

    return [
      { name: "morning", value: morning, fill: "#FFBB28" },
      { name: "afternoon", value: afternoon, fill: "#00C49F" },
      { name: "evening", value: evening, fill: "#FF8042" },
      { name: "night", value: night, fill: "#8884d8" },
    ];
  }, [users]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Avatar Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <PieChart width={730} height={250}>
              <Pie
                data={avatarDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {avatarDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signup Time of Day Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <PieChart width={730} height={250}>
              <Pie
                data={timeOfDayDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {timeOfDayDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPieChart;
