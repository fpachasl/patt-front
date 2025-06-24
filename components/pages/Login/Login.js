"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const res = await signIn("credentials", {
			redirect: false,
			username,
			password,
		});
		if (res?.ok) {
			router.push("/menu"); // cambia según tu ruta post-login
		} else {
			setError("Credenciales inválidas");
		}

		setLoading(false);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md p-8 shadow-lg">
				<img
					src="/pattern-black.png"
					alt="Pattern Black"
					className="w-32 h-full"
				/>
				<h2 className="mb-6 text-center text-2xl font-bold">Iniciar sesión</h2>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<Label htmlFor="username">Nombre de usuario</Label>
						<Input
							id="username"
							className="mt-2"
							type="username"
							placeholder="Nombre de usuario"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div>
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							className="mt-2"
							type="password"
							placeholder="********"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					{error && <p className="text-red-600">{error}</p>}
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Ingresando..." : "Entrar"}
					</Button>
				</form>
			</Card>
		</div>
	);
}
