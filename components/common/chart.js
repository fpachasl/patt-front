"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchDashboardChartData } from "@/lib/services/dashboard";

// En JS solo un objeto simple sin "satisfies"
const chartConfig = {
	projects: {
		label: "Projects",
		color: "#2563eb",
	},
	tasks: {
		label: "Tasks",
		color: "#60a5fa",
	},
};

export default function MenuChart() {
	const { data: session } = useSession(); // Obtiene el token
	const token = session?.accessToken;
	const [chartData, setChartData] = useState([])
	useEffect(() => {
		if (token) {
			fetchDashboardChartData(token)
				.then((data) => setChartData(data))
				.catch((err) => console.error(err));
		}
	}, [token]);

	return (
		<ChartContainer config={chartConfig} className="max-h-[300px] w-full">
			<BarChart data={chartData} aria-label="Sales Chart">
				<CartesianGrid />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Bar dataKey="projects" fill="var(--color-projects)" radius={4} />
				<Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
			</BarChart>
		</ChartContainer>
	);
}
