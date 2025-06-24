"use client";

import TaskDetailComponent from "@/components/pages/TasksComponent/DetailTaskComponent";
import { useParams, useRouter } from "next/navigation";
import React from "react"; // Asegúrate de importar React si usas JSX fuera de funciones

// tu componente debe ser una función válida
export default function Details() {
	const { id } = useParams();

	return <TaskDetailComponent />;
}
