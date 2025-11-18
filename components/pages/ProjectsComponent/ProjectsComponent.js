"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchAssignedProjects } from "@/lib/services/menu_member";
import { useSession } from "next-auth/react";
import { FilePlus } from "lucide-react";
import ProjectFormModal from "./ProjectForm";

export default function ProjectsComponent() {
	const { data: session } = useSession();
	const token = session?.accessToken;
	const router = useRouter();
	const [projects, setProjects] = useState([]);
	const [leaderSession, setLeaderSession] = useState(null);
	const [open, setOpen] = useState(false);
	const loadProjects = () => {
		if (token) {
			fetchAssignedProjects(token)
				.then(setProjects)
				.catch((err) => console.error(err));
		}
	};
	useEffect(() => {
		if (token) {
			loadProjects();
			setLeaderSession(session?.role == 1 || session?.role == 2);
		}
	}, [token]);

	if (!token) return <p>No autenticado</p>;

	return (
		<div className="p-6">
			{leaderSession && (
				<div className="mb-4">
					<Button onClick={() => setOpen(true)}>
						<FilePlus className="mr-2" /> Agregar Proyecto
					</Button>
				</div>
			)}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-6">
				{projects.length === 0 ? (
					<p className="col-span-full text-gray-500">
						No tienes proyectos asignados.
					</p>
				) : (
					projects.map((project) => (
						<Card key={project.id} className="shadow-md">
							<CardHeader>
								<CardTitle>{project.name}</CardTitle>
								<Badge
									className={"mt-3"}
									variant={
										project.project_state.name === "Completado"
											? "default"
											: project.project_state.name === "En planificacion" ||
											  project.project_state.name === "En progreso"
											? "secondary"
											: "outline"
									}>
									{project.project_state.name}
								</Badge>
							</CardHeader>
							<CardContent className="max-w-full text-sm text-gray-600 text-wrap break-words">
								<div className="mb-4 w-[98%]">{project.description}</div>
								<Button
									className={"cursor-pointer"}
									variant="outline"
									onClick={() => router.push(`/projects/${project.id}`)}>
									Ver detalles
								</Button>
							</CardContent>
						</Card>
					))
				)}
			</div>

			<ProjectFormModal open={open} setOpen={setOpen} token={token} reloadProjects={loadProjects} />
		</div>
	);
}
