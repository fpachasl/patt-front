"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetchProjectById } from "@/lib/services/projects";

export default function ProjectAreaDialog({
	token,
	projectId,
	open,
	setOpen,
	onAdded,
}) {
	const [users, setUsers] = useState([]);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [members, setMembers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [selectedRole, setSelectedRole] = useState("miembro");

	const [selectedLeaderId, setSelectedLeaderId] = useState("");
	const [roleLeader, setRoleLeader] = useState("");

	useEffect(() => {
		if (open) {
			api
				.get("/users/?only_company_members=true", {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setUsers(res.data))
				.catch(() => toast.error("Error al cargar usuarios"));
		}
	}, [open]);

	useEffect(() => {
		if (!open) {
			setName("");
			setDescription("");
			setSelectedLeaderId("");
			setRoleLeader("");
			setMembers([]);
			setSelectedUserId("");
			setSelectedRole("miembro");
		}
	}, [open]);
	const handleAddMember = () => {
		if (!selectedUserId) return;
		setMembers((prev) => [
			...prev,
			{ user_id: selectedUserId, role: selectedRole },
		]);
		setSelectedUserId("");
		setSelectedRole("miembro");
	};
	const handleCreateArea = async () => {
		if (!name) {
			toast.error("Debes ingresar el nombre del área");
			return;
		}

		try {
			// 1. Crear el área
			const areaRes = await api.post(
				"/project-areas/",
				{
					project: projectId,
					name,
					description,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const areaId = areaRes.data.id;

			// 2. Asignar líder
			if (selectedLeaderId) {
				await api.post(
					"/area-leaders/",
					{
						area: areaId,
						leader_id: selectedLeaderId,
						role_name: roleLeader,
					},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
			}

			// 3. Asignar miembros
			for (let member of members) {
				await api.post(
					"/project-area-members/",
					{
						area: areaId,
						user_id: member.user_id,
						role: member.role,
					},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
			}

			toast.success("Área, líder y miembros asignados correctamente");
			setOpen(false);
			if (onAdded) {
				const data = await fetchProjectById(projectId, token);
				onAdded(data); // pasar proyecto actualizado
			}
		} catch (err) {
			console.error(err);
			toast.error("Error al crear el área");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar área al proyecto</DialogTitle>
				</DialogHeader>

				<Label>Nombre del área</Label>
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Ej. Desarrollo Backend"
				/>

				<Label className="mt-2">Descripción</Label>
				<Input
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Descripción breve del área"
				/>

				<hr className="my-3" />

				<Label>Seleccionar líder del área</Label>
				<Select value={selectedLeaderId} onValueChange={setSelectedLeaderId}>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona líder" />
					</SelectTrigger>
					<SelectContent>
						{users.map((u) => (
							<SelectItem key={u.id} value={String(u.id)}>
								{u.first_name} {u.last_name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input
					placeholder="Rol del líder (opcional)"
					value={roleLeader}
					onChange={(e) => setRoleLeader(e.target.value)}
				/>

				<hr className="my-3" />

				<Label>Agregar miembro</Label>
				<div className="flex gap-2 items-center">
					<Select
						value={selectedUserId}
						onValueChange={(value) => setSelectedUserId(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona usuario" />
						</SelectTrigger>
						<SelectContent>
							{users.map((u) => (
								<SelectItem key={u.id} value={String(u.id)}>
									{u.first_name} {u.last_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						className="w-1/2"
						placeholder="Rol"
						value={selectedRole}
						onChange={(e) => setSelectedRole(e.target.value)}
					/>
					<Button type="button" onClick={handleAddMember}>
						Agregar
					</Button>
				</div>

				<ul className="mt-2 list-disc ml-5 text-sm">
					{members.map((m, i) => {
						const user = users.find((u) => u.id === Number(m.user_id));
						return (
							<li key={i}>
								{user?.first_name} {user?.last_name} ({m.role})
							</li>
						);
					})}
				</ul>

				<DialogFooter>
					<Button onClick={handleCreateArea} disabled={!name}>
						Guardar Área
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
