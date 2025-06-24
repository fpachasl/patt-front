"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserProfileById, updateUserProfile } from "@/lib/services/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ExtendedMemberProfile() {
	const { data: session } = useSession();
	const token = session?.accessToken;
	const [profile, setProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		cellphone: "",
	});

	useEffect(() => {
		if (token && session?.user_id) {
			fetchUserProfileById(session.user_id, token)
				.then((data) => {
					setProfile(data);
					setFormData({
						username: data.username || "",
						email: data.email || "",
						cellphone: data.cellphone || "",
					});
				})
				.catch((err) => {
					console.error("Error al obtener perfil", err);
				});
		}
	}, [token, session]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const updated = await updateUserProfile(formData, token);
			setProfile(updated);
			setIsEditing(false);
		} catch (error) {
		}
	};

	if (!token || !profile) return <p>Cargando perfil...</p>;

	return (
		<div className="py-6 space-y-6">
			<h1 className="text-3xl font-bold">Perfil del Colaborador</h1>
			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Datos Personales</CardTitle>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<Input name="username" value={formData.username} onChange={handleChange} placeholder="Usuario" />
							<Input name="email" value={formData.email} onChange={handleChange} placeholder="Correo" />
							<Input name="cellphone" value={formData.cellphone} onChange={handleChange} placeholder="Celular" />
							<div className="flex gap-2">
								<Button type="submit">Guardar</Button>
								<Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
							</div>
						</form>
					) : (
						<div className="space-y-2">
							<p><strong>Usuario:</strong> {profile.username}</p>
							<p><strong>Email:</strong> {profile.email}</p>
							<p><strong>Celular:</strong> {profile.cellphone ?? "No registrado"}</p>
							<p><strong>Rol:</strong> {profile.role?.name}</p>
							<Button variant="outline" onClick={() => setIsEditing(true)}>Editar</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{profile.company_user && (
				<Card>
					<CardHeader>
						<CardTitle>Información de la Empresa</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<p><strong>Empresa:</strong> {profile.company_user.company_name}</p>
						<p><strong>Rol en la empresa:</strong> {profile.company_user.role_in_company}</p>
						<p><strong>Fecha de ingreso:</strong> {profile.company_user.joined_at}</p>
					</CardContent>
				</Card>
			)}

			{profile.actions?.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Últimas Acciones</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-4 space-y-1">
							{profile.actions.slice(0, 5).map((log) => (
								<li key={log.id}>
									{log.timestamp} — <strong>{log.action}</strong>
									{log.metadata?.description && <> — {log.metadata.description}</>}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
