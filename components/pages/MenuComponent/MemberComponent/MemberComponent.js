"use client";

import { fetchDashboardData } from "@/lib/services/dashboard";
import { useEffect, useState } from "react";
import MetricsCard from "../MetricsCardComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentActivity from "../RecentActivityComponent";
import { Separator } from "@/components/ui/separator";
import AssignedProjects from "../AssignedProjectsComponent";

export default function MemberComponent({ token }) {
	const [dashboard, setDashboard] = useState(null);

	useEffect(() => {
		if (token) {
			fetchDashboardData(token)
				.then(setDashboard)
				.catch((err) => console.error(err));
		}
	}, [token]);

	if (!token) return <p>No autenticado</p>;

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Mi Panel</h1>
			<Separator />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
				<MetricsCard title="Tareas pendientes" value={dashboard?.pending_tasks ?? 0} />
				<MetricsCard title="Tareas en progreso" value={dashboard?.tasks_in_progress ?? 0} />
				<MetricsCard title="Tareas completadas" value={dashboard?.tasks_completed ?? 0} />
				<MetricsCard title="Proyectos asignados" value={dashboard?.projects_assigned ?? 0} />

				<Card>
					<CardHeader>
						<CardTitle>Actividad reciente</CardTitle>
					</CardHeader>
					<CardContent>
						<RecentActivity token={token} />
					</CardContent>
				</Card>

				<AssignedProjects token={token} />

			</div>
		</div>
	);
}
