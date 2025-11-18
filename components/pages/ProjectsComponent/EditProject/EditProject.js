import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { updateProject } from "@/lib/services/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProject({ data, token, onSaved, onCancel }) {
	const [form, setForm] = useState({
		name: "",
		description: "",
		end_date: "",
		project_type: "",
		project_state: "",
		company: "",
		priority: "",
	});
	const router = useRouter();

	const [types, setTypes] = useState([]);
	const [states, setStates] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [priorities, setPriorities] = useState([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (data) {
			setForm({
				name: data.name || "",
				description: data.description || "",
				end_date: data.end_date ? data.end_date.slice(0, 10) : "",
				project_type: String(data.project_type?.id || ""),
				project_state: String(data.project_state?.id || ""),
				company: String(data.company?.id || ""),
				priority: String(data.priority?.id || ""),
			});
		}
	}, [data]);

	useEffect(() => {
		api
			.get("/project-types/", { headers: { Authorization: `Bearer ${token}` } })
			.then((res) => setTypes(res.data));
		api
			.get("/project-states/", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setStates(res.data));
		api
			.get("/companies/", { headers: { Authorization: `Bearer ${token}` } })
			.then((res) => setCompanies(res.data));
		api
			.get("/project-priorities/", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setPriorities(res.data));
	}, [token]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (field, value) => {
		setForm({ ...form, [field]: value });
	};

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			console.log(form);
			const response = await updateProject(
				{ project_id: data.id, ...form },
				token
			);
			toast.success("Proyecto actualizado correctamente");
			if (onSaved) onSaved(response.data); // Puedes pasar el nuevo proyecto actualizado
		} catch (err) {
			console.error("Error al actualizar proyecto", err);
			toast.error("Error al actualizar el proyecto");
		}
		setSaving(false);
	};

	return (
		<div className="space-y-4">
			<div className="flex">
				<Label>Tipo:</Label>
				<Select
					value={form.project_type}
					onValueChange={(val) => handleSelectChange("project_type", val)}>
					<SelectTrigger className="w-full ml-2">
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
			</div>
			<div className="flex">
				<Label>Prioridad:</Label>
				<Select
					value={form.priority}
					onValueChange={(val) => handleSelectChange("priority", val)}>
					<SelectTrigger className="w-full ml-2">
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
			</div>
			<div className="flex">
				<Label>Empresa:</Label>
				<Select
					value={form.company}
					onValueChange={(val) => handleSelectChange("company", val)}>
					<SelectTrigger className="w-full ml-2">
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
			</div>

			<div className="flex">
				<Label>Entrega:</Label>
				<Input
					className="w-full ml-2"
					type="date"
					name="end_date"
					value={form.end_date}
					onChange={handleChange}
				/>
			</div>

			<Separator className="my-4" />

			<div>
				<Label>Descripción:</Label>
				<Textarea
					name="description"
					value={form.description}
					onChange={handleChange}
					className="min-h-[120px] resize-none my-4"
				/>
			</div>

			<div>
				<Label>Estado:</Label>
				<Select
					value={form.project_state}
					onValueChange={(val) => handleSelectChange("project_state", val)}>
					<SelectTrigger className="my-4 cursor-pointer">
						<SelectValue placeholder="Selecciona un estado" />
					</SelectTrigger>
					<SelectContent>
						{states.map((s) => (
							<SelectItem key={s.id} value={String(s.id)}>
								{s.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Button className="my-4 cursor-pointer" onClick={handleSaveChanges} disabled={saving}>
				{saving ? "Guardando..." : "Guardar Cambios"}
			</Button>
		</div>
	);
}
