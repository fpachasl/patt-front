import api from "@/lib/api";

export async function fetchUserProfileById(id, token) {
	const res = await api.get(`/users/${id}/by-id/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (res.status !== 200) throw new Error("Error al obtener perfil por ID");
	return res.data;
}

export async function updateUserProfile(data, token) {
	const res = await api.put("/users/update-profile/", data, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	if (res.status !== 200 && res.status !== 201) {
		throw new Error("Error al actualizar perfil");
	}
	return res.data;
}