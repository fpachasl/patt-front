"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
export default function ProjectFormModal({
	open,
	setOpen,
	token,
	reloadProjects,
}) {
	const [form, setForm] = useState({
		name: "",
		description: "",
		end_date: "",
		project_type: "",
		project_state: "",
		company: "",
		priority: "",
	});
	const [types, setTypes] = useState([]);
	const [states, setStates] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [priorities, setPriorities] = useState([]);

	useEffect(() => {
		if (open) {
			api
				.get("/project-types/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => setTypes(res.data));
			api
				.get("/project-states/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => setStates(res.data));
			api
				.get("/companies/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => setCompanies(res.data));
			api
				.get("/project-priorities/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => setPriorities(res.data));
		}
	}, [open]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (field, value) => {
		setForm({ ...form, [field]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validación: verifica que todos los campos estén llenos
		const requiredFields = [
			"name",
			"description",
			"end_date",
			"project_type",
			"project_state",
			"company",
			"priority",
		];
		const emptyFields = requiredFields.filter((field) => !form[field]);

		if (emptyFields.length > 0) {
			toast.error("Por favor, complete todos los campos obligatorios.");
			return;
		}

		try {
			const res = await api.post("/projects/", form, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.status === 201) {
				reloadProjects();
				setForm({
					name: "",
					description: "",
					end_date: "",
					project_type: "",
					project_state: "",
					company: "",
					priority: "",
				});
				toast.success("Proyecto creado satisfactoriamente");
				setOpen(false);
			} else {
				toast.error("Ocurrió un error en la creación");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error al crear el proyecto");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Registrar nuevo proyecto</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="min-w-full space-y-4">
					<Input
						name="name"
						placeholder="Nombre del proyecto"
						value={form.name}
						onChange={handleChange}
						required
					/>
					<Textarea
						className="resize-none"
						name="description"
						placeholder="Descripción"
						value={form.description}
						onChange={handleChange}
					/>

					<Input
						type="date"
						name="end_date"
						value={form.end_date}
						onChange={handleChange}
					/>

					<Select
						onValueChange={(value) =>
							handleSelectChange("project_type", value)
						}>
						<SelectTrigger>
							<SelectValue placeholder="Tipo de proyecto" />
						</SelectTrigger>
						<SelectContent>
							{types.map((t) => (
								<SelectItem key={t.id} value={String(t.id)}>
									{t.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) =>
							handleSelectChange("project_state", value)
						}>
						<SelectTrigger>
							<SelectValue placeholder="Estado del proyecto" />
						</SelectTrigger>
						<SelectContent>
							{states.map((s) => (
								<SelectItem key={s.id} value={String(s.id)}>
									{s.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) => handleSelectChange("company", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Empresa" />
						</SelectTrigger>
						<SelectContent>
							{companies.map((c) => (
								<SelectItem key={c.id} value={String(c.id)}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						onValueChange={(value) => handleSelectChange("priority", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Prioridad" />
						</SelectTrigger>
						<SelectContent>
							{priorities.map((p) => (
								<SelectItem key={p.id} value={String(p.id)}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}>
							Cancelar
						</Button>
						<Button type="submit">Guardar</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
