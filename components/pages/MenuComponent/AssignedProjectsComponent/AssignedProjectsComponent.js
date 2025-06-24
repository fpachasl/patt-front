"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { fetchAssignedProjects } from "@/lib/services/menu_member";

export default function AssignedProjects({ token }) {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		if (token) {
			fetchAssignedProjects(token)
				.then(setProjects)
				.catch((err) => console.error(err));
		}
	}, [token]);

	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Mis proyectos asignados</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				{projects.length === 0 ? (
					<p className="text-muted-foreground">No tienes proyectos asignados.</p>
				) : (
					<ul className="space-y-2">
						{projects.map((project) => (
							<li key={project.id} className="flex justify-between items-center border-b pb-2">
								<div>
									<p className="font-medium">{project.name}</p>
									<p className="text-sm text-muted-foreground">Estado: {project.state}</p>
								</div>
								<Link href={`/projects/${project.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
									Ver
								</Link>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
