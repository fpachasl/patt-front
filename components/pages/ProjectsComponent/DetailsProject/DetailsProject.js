"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { fetchProjectById, updateProject } from "@/lib/services/projects";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ProjectTasksPanel from "../TaskPanelComponent";

export default function DetailsProject({ token }) {
	const { id } = useParams();
	const router = useRouter();
	const { data: session } = useSession();
	const userRole = session?.user?.role?.code;

	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [editableDescription, setEditableDescription] = useState("");
	const [editableState, setEditableState] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const data = await fetchProjectById(id, token);
				setProject(data);
				setEditableDescription(data.description || "");
				setEditableState(data.project_state?.id || "");
			} catch (err) {
				console.error(err);
				setError("Proyecto no encontrado o no autorizado.");
			} finally {
				setLoading(false);
			}
		};
		if (id && token) fetchProject();
	}, [id, token]);

	const isEditable = userRole === "admin" || userRole === "leader";

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			await updateProject(
				id,
				{
					description: editableDescription,
					project_state: editableState,
				},
				token
			);
			router.refresh();
		} catch (err) {
			console.error("Error actualizando proyecto", err);
		}
		setSaving(false);
	};

	if (loading) return <div className="p-6">Cargando...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	return (
		<div className=" px-6 py-8 space-y-10">
			{/* Encabezado principal */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">{project.name}</h1>
				<Badge variant="secondary">{project.project_state?.name}</Badge>
			</div>

			<Separator />

			{/* Grid: Izquierda = info editable | Derecha = líderes + áreas */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Información del proyecto */}
				<Card>
					<CardHeader>
						<CardTitle>Información del Proyecto</CardTitle>
						<CardDescription>
							Resumen general y campos editables
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<p>
							<strong>Tipo:</strong> {project.project_type?.name} —{" "}
							<small>{project.project_type?.description}</small>
						</p>
						<p>
							<strong>Prioridad:</strong> {project.priority?.name} —{" "}
							<small>{project.priority?.description}</small>
						</p>
						<p>
							<strong>Empresa:</strong> {project.company?.name} (
							{project.company?.ruc})
						</p>
						<p>
							<strong>Dirección:</strong>{" "}
							<small>{project.company?.address}</small>
						</p>
						<p>
							<strong>Inicio:</strong> {project.start_date}
						</p>
						<p>
							<strong>Entrega:</strong> {project.end_date}
						</p>

						<Separator className="my-4" />

						{isEditable ? (
							<>
								<Label>Descripción</Label>
								<Textarea
									value={editableDescription}
									onChange={(e) => setEditableDescription(e.target.value)}
									className="min-h-[120px]"
								/>

								<Label className="mt-4">Estado</Label>
								<Select value={editableState} onValueChange={setEditableState}>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona un estado" />
									</SelectTrigger>
									<SelectContent>
										{project.available_states?.map((state) => (
											<SelectItem key={state.id} value={String(state.id)}>
												{state.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Button
									className="mt-4"
									onClick={handleSaveChanges}
									disabled={saving}>
									{saving ? "Guardando..." : "Guardar Cambios"}
								</Button>
							</>
						) : (
							<p>
								<strong>Descripción:</strong> {project.description}
							</p>
						)}

						<Button
							variant="outline"
							className="mt-6"
							onClick={() => router.back()}>
							Volver
						</Button>
					</CardContent>
				</Card>

				{/* Detalles de líderes y áreas */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Líderes del proyecto</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm">
								{project.leaders.map((leaderEntry) => (
									<li key={leaderEntry.id}>
										<span className="font-medium">
											{leaderEntry.leader.first_name}{" "}
											{leaderEntry.leader.last_name}
										</span>
										{leaderEntry.is_main && (
											<Badge variant="default" className="ml-2">
												Principal
											</Badge>
										)}
										<br />
										<small className="text-muted-foreground">
											{leaderEntry.leader.email} —{" "}
											{leaderEntry.leader.company_user?.role_in_company}
										</small>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Áreas y Miembros</CardTitle>
							<CardDescription>Desglose por equipo</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="max-h-[300px] pr-4">
								{project.areas.map((area) => (
									<div key={area.id} className="mb-4">
										<p className="font-semibold">{area.name}</p>
										<p className="text-muted-foreground text-sm mb-1">
											{area.description}
										</p>
										<ul className="ml-4 list-disc text-sm">
											{area.members.map((m) => (
												<li key={m.id}>
													{m.user.first_name} {m.user.last_name} ({m.role})
												</li>
											))}
										</ul>
										<Separator className="my-3" />
									</div>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
					<ProjectTasksPanel projectId={project.id} token={token} />
				</div>
			</div>
		</div>
	);
}
