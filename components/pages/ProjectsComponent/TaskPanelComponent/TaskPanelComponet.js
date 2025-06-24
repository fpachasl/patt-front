import { useEffect, useState } from "react";
import { fetchTasksByProject } from "@/lib/services/tasks";

export default function ProjectTasksPanel({ projectId, token }) {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchTasksByProject(projectId, token);
				setTasks(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		if (projectId && token) fetchData();
	}, [projectId, token]);

	if (loading) return <p>Cargando tareas...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Tareas del Proyecto</h3>
			{tasks.length === 0 ? (
				<p>No hay tareas disponibles.</p>
			) : (
				<ul className="space-y-2">
					{tasks.map((task) => (
						<li
							key={task.id}
							className="border rounded-md p-3 hover:bg-muted transition">
							<p className="font-medium">{task.title}</p>
							<p className="text-sm text-gray-600">
								Estado: {task.task_state?.name || "Sin estado"}
							</p>
							<p className="text-sm">
								Asignado a: {task.assigned_user?.first_name || "Sin asignar"}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
