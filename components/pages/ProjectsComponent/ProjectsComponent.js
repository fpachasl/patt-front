"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchAssignedProjects } from "@/lib/services/menu_member";
import { useSession } from "next-auth/react";

export default function ProjectsComponent() {
	const { data: session } = useSession();
	const token = session?.accessToken;
	const router = useRouter();
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		if (token) {
			fetchAssignedProjects(token)
				.then(setProjects)
				.catch((err) => console.error(err));
		}
	}, [token]);

	if (!token) return <p>No autenticado</p>;

	return (
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
									project.state === "Completado"
										? "default"
										: project.state === "En progreso"
										? "secondary"
										: "outline"
								}>
								{project.state}
							</Badge>
						</CardHeader>
						<CardContent className="text-sm text-gray-600">
							<p className="mb-4">{project.description}</p>
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
	);
}
