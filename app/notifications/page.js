"use client";
import NotificationsComponent from "@/components/pages/NotificationsComponent";
import { useSession } from "next-auth/react";
import React from "react"; // Asegúrate de importar React si usas JSX fuera de funciones

export default function Notifications() {
	const { data: session } = useSession();
	const token = session?.accessToken;

	return <NotificationsComponent token={token} />;
}
