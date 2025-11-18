"use client";

import { useEffect, useState } from "react";
import {
	fetchTasksByProject,
	createTask,
	assignTaskUser,
	fetchProjectMembers,
} from "@/lib/services/tasks";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CreateTaskDialog from "./CreateTaskDialog";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ProjectTasksPanel({ projectId, token, isEditable }) {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [assignUserId, setAssignUserId] = useState("");
	const [members, setMembers] = useState([]);
	const [selectedTaskId, setSelectedTaskId] = useState(null);
	const [taskStates, setTaskStates] = useState([]);
	const [projectAreas, setProjectAreas] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const loadExtras = async () => {
		try {
			const taskStatesData = await api
				.get("/task-states/", {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => res.data);
			const areasData = await api
				.get(`/project-areas/?project=${projectId}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => res.data);

			setTaskStates(taskStatesData);
			setProjectAreas(areasData);
		} catch (err) {
			console.error("Error cargando datos adicionales:", err.message);
		}
	};

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

	const loadMembers = async () => {
		try {
			const data = await fetchProjectMembers(projectId, token);
			setMembers(data);
		} catch (err) {
			console.error("Error al cargar miembros:", err.message);
		}
	};

	useEffect(() => {
		if (projectId && token) {
			fetchData();
			loadMembers();
			loadExtras();
		}
	}, [projectId, token]);

	const handleCreateTask = async (taskData) => {
		try {
			await createTask({ ...taskData, project: projectId }, token);
			toast.success("Tarea creada correctamente");
			setIsDialogOpen(false);
			fetchData();
		} catch (err) {
			toast.error("Error al crear tarea: " + err.message);
		}
	};

	const handleAssignUser = async (taskId) => {
		try {
			const data = {
				task_id: taskId,
				assigned_user: assignUserId,
			};
			await assignTaskUser(data, token);
			toast.success("Usuario asignado correctamente");
			setAssignUserId("");
			setSelectedTaskId(null);
			fetchData();
		} catch (err) {
			toast.error("Error al asignar usuario: " + err.message);
		}
	};

	if (loading) return <p>Cargando tareas...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="w-full space-y-4">
			<div className="w-full flex justify-between items-center">
				<h3 className="text-lg font-semibold">Tareas del Proyecto</h3>
				<CreateTaskDialog
					onCreate={handleCreateTask}
					taskStates={taskStates}
					areas={projectAreas}
					members={members}
					isOpen={isDialogOpen}
					onOpenChange={setIsDialogOpen}
				/>
			</div>

			{tasks.length === 0 ? (
				<p>No hay tareas disponibles.</p>
			) : (
				<ul className="grid grid-cols-3 gap-6 w-full space-y-2">
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
							<p className="text-sm text-gray-500">
								Fecha de creación:{" "}
								{new Date(task.created_at).toLocaleDateString()}
							</p>
							<a
								href={`/task/${task.id}`}
								className="text-gray-500 font-bold text-sm underline">
								Ver detalles
							</a>

							{/* Botón para asignar usuario */}
							<div className="mt-2 space-x-2">
								{selectedTaskId === task.id ? (
									<>
										<Select
											value={assignUserId}
											onValueChange={(value) => setAssignUserId(value)}>
											<SelectTrigger className="w-48">
												<SelectValue placeholder="Selecciona usuario" />
											</SelectTrigger>
											<SelectContent>
												{members.map((member) => (
													<SelectItem key={member.id} value={String(member.id)}>
														{member.first_name} {member.last_name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<div className="my-4 grid grid-cols-2 gap-6">
											<Button onClick={() => handleAssignUser(task.id)}>
												Asignar
											</Button>
											<Button onClick={() => setSelectedTaskId(null)}>
												Cancelar
											</Button>
										</div>
									</>
								) : (
									<div>
										{isEditable && (
											<Button onClick={() => setSelectedTaskId(task.id)}>
												Asignar a alguien
											</Button>
										)}
									</div>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
