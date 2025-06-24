import api from "@/lib/api";

export async function fetchAssignedProjects(token) {
	try {
		const response = await api.get("/projects/assigned/", {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener proyectos asignados:", error);
		throw error;
	}
}