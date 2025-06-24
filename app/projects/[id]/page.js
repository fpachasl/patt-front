"use client";

import DetailsProject from "@/components/pages/ProjectsComponent/DetailsProject";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react"; // Asegúrate de importar React si usas JSX fuera de funciones

// tu componente debe ser una función válida
export default function Details() {
	const { data: session } = useSession();
	const token = session?.accessToken;

	if (!token) return <p>No autenticado</p>

	return <DetailsProject token={token} />;
}
