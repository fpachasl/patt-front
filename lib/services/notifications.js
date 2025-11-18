import api from "@/lib/api";

// Obtener todas las notificaciones del usuario en sesión
export async function fetchAllNotifications(token, pageOrUrl = 1) {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	// Si es número, construye la URL base
	if (typeof pageOrUrl === "number") {
		return api.get(`/notifications/all/?page=${pageOrUrl}`, config).then(res => res.data);
	} else {
		// Si es URL completa (viene de `data.next`)
		return api.get(pageOrUrl, config).then(res => res.data);
	}
}