// components/tasks/CreateTaskDialog.jsx
"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTaskDialog({
	onCreate,
	taskStates = [],
	areas = [],
	members = [],
	isOpen,
	onOpenChange,
}) {
	const { data: session } = useSession();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [taskStateId, setTaskStateId] = useState("");
	const [areaId, setAreaId] = useState("");
	const [assignedUserId, setAssignedUserId] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validación de fechas
		if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
			setErrorMsg(
				"La fecha de inicio no puede ser posterior a la fecha de fin."
			);
			return;
		}

		setErrorMsg("");

		await onCreate({
			title,
			start_date: startDate || null,
			end_date: endDate || null,
			task_state: taskStateId || null,
			area: areaId || null,
			assigned_user: assignedUserId || null,
			assigned_by: session.user_id,
			creator_user: session.user_id,
		});

		// limpiar
		setTitle("");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setTaskStateId("");
		setAreaId("");
		setAssignedUserId("");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>Agregar Tarea</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Crear Nueva Tarea</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						placeholder="Título"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<Textarea
						placeholder="Descripción de la tarea"
						required
                        value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={"resize-none"}
					/>
					<div className="grid grid-cols-2 gap-5">
						<div className="flex flex-col">
							<p>Fecha de inicio</p>
							<Input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="flex flex-col">
							<p>Fecha fin</p>
							<Input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
					</div>

					{errorMsg && (
						<p className="text-sm text-red-500 font-medium">{errorMsg}</p>
					)}
					<div className="grid grid-cols-2 gap-5">
						<Select value={taskStateId} onValueChange={setTaskStateId}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Estado de la tarea" />
							</SelectTrigger>
							<SelectContent>
								{taskStates.map((state) => (
									<SelectItem key={state.id} value={String(state.id)}>
										{state.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={areaId} onValueChange={setAreaId}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Área" />
							</SelectTrigger>
							<SelectContent>
								{areas.map((area) => (
									<SelectItem key={area.id} value={String(area.id)}>
										{area.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Select value={assignedUserId} onValueChange={setAssignedUserId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Asignar a..." />
						</SelectTrigger>
						<SelectContent>
							{members.map((member) => (
								<SelectItem key={member.id} value={String(member.id)}>
									{member.first_name} {member.last_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<DialogFooter>
						<Button type="submit" className="w-full  text-white">
							Crear
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
