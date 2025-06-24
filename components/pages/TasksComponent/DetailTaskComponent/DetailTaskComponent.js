"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	fetchTaskDetail,
	fetchTaskStates,
	updateTaskState,
} from "@/lib/services/tasks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CommentSection from "../CommentsComponent";

export default function TaskDetailComponent() {
	const { data: session } = useSession();
	const { id } = useParams();
	const token = session?.accessToken;
	const [task, setTask] = useState(null);
	const [taskStates, setTaskStates] = useState([]);

	useEffect(() => {
		if (token && id) {
			fetchTaskDetail(id, token).then(setTask).catch(console.error);
			fetchTaskStates(token).then(setTaskStates).catch(console.error);
		}
	}, [token, id]);

	const handleTaskStateChange = async (value) => {
		if (value === task.task_state?.id.toString()) {
			console.log(
				"El estado seleccionado es el mismo que el actual. No se actualiza."
			);
			return;
		}

		try {
			const res = await updateTaskState(id, value, token);

			const updated = await fetchTaskDetail(id, token);

			setTask(updated);
		} catch (err) {
			throw new Error(
				error?.response?.data?.detail ||
					"Error al actualizar el estado de la tarea"
			);
		}
	};

	if (!task) return <p>Cargando tarea...</p>;

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Detalle de Tarea</h1>
			<Separator />

			<Alert className="bg-muted border-l-4 border-primary">
				<AlertTitle className="flex justify-between items-center text-lg font-semibold">
					<span>{task.title}</span>
					<div className="space-y-2">
						<Label className={""}>Cambiar estado</Label>
						<Select
							onValueChange={handleTaskStateChange}
							value={task.task_state?.id.toString()}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona nuevo estado" />
							</SelectTrigger>
							<SelectContent>
								{taskStates.map((state) => (
									<SelectItem key={state.id} value={state.id.toString()}>
										{state.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</AlertTitle>
				<AlertDescription className="my-2 text-sm text-muted-foreground">
					Asignada por {task.assigned_by?.username || "Desconocido"} para el
					proyecto <strong>{task.project?.name || "No asignado"}</strong>
				</AlertDescription>
			</Alert>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label>Descripción</Label>
					<Textarea
						readOnly
						value={task.description || "Sin descripción"}
						className="resize-none"
					/>
				</div>

				<div className="space-y-2">
					<Label>Área</Label>
					<p className="text-muted-foreground">
						{task.area?.name || "No especificada"}
					</p>
				</div>

				<div className="space-y-2">
					<Label>Fecha de inicio</Label>
					<p>
						{task.start_date
							? new Date(task.start_date).toLocaleDateString()
							: "No definida"}
					</p>
				</div>

				<div className="space-y-2">
					<Label>Fecha límite</Label>
					<p>
						{task.end_date
							? new Date(task.end_date).toLocaleDateString()
							: "No definida"}
					</p>
				</div>

				<div className="space-y-2">
					<Label>Asignado por</Label>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="text-muted-foreground cursor-help">
								{task.assigned_by?.username || "N/A"}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							{task.assigned_by?.email || "Sin correo disponible"}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div>
				<CommentSection taskId={id} token={token} />
			</div>
		</div>
	);
}
