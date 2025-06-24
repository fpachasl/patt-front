"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchAssignedTasks } from "@/lib/services/tasks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function TaskComponent() {
	const { data: session } = useSession();
	const token = session?.accessToken;
	const [tasks, setTasks] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (token) {
			fetchAssignedTasks(token)
				.then((data) => setTasks(data))
				.catch((err) => console.error("Error al obtener tareas:", err));
		}
	}, [token]);

	if (!token) return <p>Cargando autenticación...</p>;

	return (
		<div className="py-6 space-y-6">
			<h1 className="text-3xl font-bold">Mis Tareas</h1>
			<Separator />

			{tasks.length === 0 ? (
				<p>No tienes tareas asignadas.</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{tasks.map((task) => (
						<Card key={task.id} className="shadow-md">
							<CardHeader>
								<CardTitle className="flex justify-between items-center">
									<span>{task.title}</span>
									<Badge variant={getStatusVariant(task.task_state?.code)}>
										{task.task_state?.name}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-gray-700 space-y-2">
								<p>{task.description}</p>
								<p>
									<strong>Proyecto:</strong> {task.project?.name}
								</p>
								<p>
									<strong>Fecha límite:</strong>{" "}
									{task.end_date
										? new Date(task.end_date).toLocaleDateString()
										: "Sin fecha"}
								</p>
								<Button
                                    className={"cursor-pointer"}
									variant="outline"
									onClick={() => router.push(`/task/${task.id}`)}>
									Ver detalle
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

// Asigna color según estado de la tarea
function getStatusVariant(status) {
	switch (status) {
		case "pendiente":
			return "outline";
		case "en_progreso":
			return "secondary";
		case "completada":
			return "default";
		default:
			return "outline";
	}
}
