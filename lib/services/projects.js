import api from "@/lib/api";

export async function fetchProjectById(id, token) {
	try {
		const res = await api.get(`/projects/${id}/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (error) {
		throw new Error(error.response?.data?.detail || "Error al obtener el proyecto");
	}
}
