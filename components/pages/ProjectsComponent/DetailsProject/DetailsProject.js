"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {
	fetchProjectById,
	fetchStateProject,
	updateProject,
} from "@/lib/services/projects";
import { Badge } from "@/components/ui/badge";

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
import { Edit } from "lucide-react";
import EditProject from "../EditProject";
import ProjectLeaderDialog from "../ProjectLeaderDialog";
import ProjectAreaDialog from "../../ProjectAreaDialog";

export default function DetailsProject({ token }) {
	const { id } = useParams();
	const router = useRouter();
	const { data: session } = useSession();
	const userRole = session?.role;

	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	const [modalMember, setModalMembers] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const data = await fetchProjectById(id, token);
				setProject(data);
			} catch (err) {
				console.error(err);
				setError("Proyecto no encontrado o no autorizado.");
			} finally {
				setLoading(false);
			}
		};
		const stateProject = async () => {
			try {
				const states = await fetchStateProject(token);
			} catch (err) {
				console.error("Error al obtener los estados del proyecto", err);
				setError("Error al cargar los estados del proyecto.");
			}
		};
		if (id && token) {
			fetchProject();
			stateProject();
		}
	}, [id, token]);

	const isEditable = userRole === 1 || userRole === 2;

	if (loading) return <div className="p-6">Cargando...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	return (
		<div className=" px-6  space-y-8">
			{/* Encabezado principal */}
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">{project?.name}</h1>
				<Badge variant="secondary">{project?.project_state?.name}</Badge>
			</div>
			{isEditable && (
				<div className="w-4">
					{!isEditing ? (
						<Button
							className={"cursor-pointer"}
							onClick={() => {
								setIsEditing(true);
							}}>
							Editar <Edit />
						</Button>
					) : (
						<Button
							className={"cursor-pointer"}
							onClick={() => {
								setIsEditing(false);
							}}>
							Cancelar edicion <Edit />
						</Button>
					)}
				</div>
			)}

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
						{isEditable && isEditing ? (
							<EditProject
								data={project}
								token={token}
								onSaved={(updated) => {
									setProject(updated);
									setIsEditing(false);
									router.refresh();
								}}
							/>
						) : (
							<>
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

								<p>
									<strong>Descripción:</strong> {project.description}
								</p>
								<Button
									variant="outline"
									className="mt-6 "
									onClick={() => router.back()}>
									Volver
								</Button>
							</>
						)}
					</CardContent>
				</Card>

				{/* Detalles de líderes y áreas */}
				<div className="space-y-4">
					<Card className={"gap-0"}>
						<CardHeader className={"flex"}>
							<CardTitle>Líderes del proyecto </CardTitle>
							{isEditable && (
								<Button onClick={() => setOpen(true)} className={"ml-auto"}>
									Agregar
								</Button>
							)}
							<ProjectLeaderDialog
								open={open}
								setOpen={setOpen}
								token={token}
								projectId={project.id}
								onAdded={(updated) => setProject(updated)}
							/>
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

					<Card className={"gap-0"}>
						<CardHeader className={"flex"}>
							<CardTitle>Áreas y Miembros - Desglose por equipo</CardTitle>

							{isEditable && (
								<Button
									onClick={() => setModalMembers(true)}
									className={"ml-auto"}>
									Agregar
								</Button>
							)}
						</CardHeader>
						<CardContent>
							<ScrollArea className="max-h-[300px] pr-4">
								{project.areas.map((area) => (
									<div key={area.id} className="">
										<p className="font-semibold">{area.name}</p>

										<p className=" text-sm mb-1">Lideres del area</p>
										<ul className="text-muted-foreground ml-4 list-disc text-sm">
											{area.leaders.map((m) => (
												<li key={m.id}>
													{m.leader.first_name} {m.leader.last_name} (
													{m.role_name})
												</li>
											))}
										</ul>

										<p className=" text-sm mb-1">Miembros del area</p>
										<ul className="text-muted-foreground ml-4 list-disc text-sm">
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
				</div>
				<div className="col-span-2">
					<ProjectTasksPanel
						projectId={project.id}
						token={token}
						isEditable={isEditable}
					/>
				</div>
				<ProjectAreaDialog
					open={modalMember}
					setOpen={setModalMembers}
					token={token}
					projectId={project.id}
					onAdded={(updated) => setProject(updated)}
				/>
			</div>
		</div>
	);
}
