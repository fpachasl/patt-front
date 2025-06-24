import api from "@/lib/api";

export async function fetchComments(taskId, token) {
	const res = await api.get(`/comments/?task=${taskId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}

export async function postComment(taskId, content, token, files = []) {
	const formData = new FormData();
	formData.append("task", taskId);
	formData.append("content", content);

	// Agregar archivos si existen
	files.forEach((file) => {
		formData.append("attachments", file); // "attachments" debe coincidir con el nombre del campo ManyToMany o related_name en el backend
	});

	const res = await api.post(`/comments/`, formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});

	return res.data;
}
