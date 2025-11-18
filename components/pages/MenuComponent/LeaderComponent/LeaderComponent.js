import MenuChart from "@/components/common/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchDashboardData } from "@/lib/services/dashboard";
import { useEffect, useState } from "react";
import RecentActivity from "../RecentActivityComponent";
import MetricsCard from "../MetricsCardComponent";
import ReportsAdminLeader from "./ReportsAdminLeader";

export default function LeaderComponent({ token, role }) {
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
			<h1 className="text-3xl font-bold">Dashboard del Líder</h1>
			<Separator />

			{/* Métricas principales */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<MetricsCard
					title="Proyectos activos"
					value={dashboard?.in_progress ?? 0}
				/>
				<MetricsCard
					title="Proyectos finalizados"
					value={dashboard?.completed ?? 0}
				/>
				<MetricsCard
					title="Proyectos con retraso"
					value={dashboard?.delayed ?? 0}
					color="text-red-600"
				/>
				<MetricsCard
					title="Tareas pendientes"
					value={dashboard?.pending_tasks ?? 0}
				/>
				<MetricsCard
					title="Tareas en progreso"
					value={dashboard?.tasks_in_progress ?? 0}
				/>
				<MetricsCard
					title="Miembros del equipo"
					value={dashboard?.team_members ?? 0}
				/>

				{/* Actividad reciente */}
				<Card>
					<CardHeader>
						<CardTitle>Actividad reciente</CardTitle>
					</CardHeader>
					<CardContent className="">
						<RecentActivity token={token} />
					</CardContent>
				</Card>

				{/* MenuChart que abarca dos columnas */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle>Progreso general de los proyectos</CardTitle>
					</CardHeader>
					<CardContent>
						<MenuChart />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Reportes:</CardTitle>
					</CardHeader>
					<CardContent>
						<ReportsAdminLeader token={token} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
