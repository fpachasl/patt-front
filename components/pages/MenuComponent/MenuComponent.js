"use client";

import { useSession } from "next-auth/react";
import LeaderComponent from "./LeaderComponent";
import MemberComponent from "./MemberComponent";

export default function MenuComponent() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p>Cargando...</p>;
	const role = session?.role;
	const token = session?.accessToken;

	if (role === 1 || role === 2) {
		return <LeaderComponent token={token} role={role} />;
	}
	if (role === 3) {
		return <MemberComponent token={token} role={role} />;
	}

	return <p>No autorizado o rol no reconocido.</p>;
}
