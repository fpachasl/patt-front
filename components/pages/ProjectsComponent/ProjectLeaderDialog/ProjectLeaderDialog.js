"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { fetchProjectById } from "@/lib/services/projects";

export default function ProjectLeaderDialog({
	open,
	setOpen,
	projectId,
	token,
	onAdded,
}) {
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [isMain, setIsMain] = useState(false);

	useEffect(() => {
		if (open) {
			api
				.get("/users/?only_company_members=true", {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setUsers(res.data))
				.catch(() => toast.error("Error al cargar usuarios"));
		}
	}, [open, token]);

	const handleAdd = async () => {
		try {
			await api.post(
				"/project-leaders/",
				{
					project_id: projectId,
					leader_id: selectedUserId,
					is_main: isMain,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Líder agregado exitosamente");
			setOpen(false);
			if (onAdded) {
				const data = await fetchProjectById(projectId, token);
				onAdded(data); // pasar proyecto actualizado
			}
		} catch (err) {
			console.error(err);
			toast.error("No se pudo agregar el líder");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar líder al proyecto</DialogTitle>
				</DialogHeader>

				<Label>Selecciona un usuario</Label>
				<Select value={selectedUserId} onValueChange={setSelectedUserId}>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona un usuario" />
					</SelectTrigger>
					<SelectContent>
						{users.map((user) => (
							<SelectItem key={user.id} value={String(user.id)}>
								{user.first_name} {user.last_name} ({user.email})
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="flex items-center space-x-2 mt-4">
					<input
						type="checkbox"
						id="is_main"
						checked={isMain}
						onChange={(e) => setIsMain(e.target.checked)}
					/>
					<Label htmlFor="is_main">¿Es líder principal?</Label>
				</div>

				<DialogFooter>
					<Button onClick={handleAdd} disabled={!selectedUserId}>
						Agregar líder
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
