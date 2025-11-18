import api from "@/lib/api";

export async function fetchAssignedTasks(token) {
	const res = await api.get("/tasks/assigned/", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok && res.status !== 200) throw new Error("Error al obtener tareas");
	return res.data;
}

export async function fetchTaskDetail(id, token) {
	const res = await api.get(`/tasks/${id}/detail/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (res.status !== 200)
		throw new Error("Error al obtener detalle de la tarea");
	return res.data;
}

export async function updateTaskState(taskId, newStateId, token) {
	try {
		const res = await api.patch(
			`/tasks/${taskId}/update-state/`,
			{ task_state: newStateId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return res.data;
	} catch (error) {
		// 👇 Esto sí captura errores reales como status 400, 403, etc.
		console.error(
			"❌ Error actualizando tarea:",
			error.response?.data || error.message
		);
		throw new Error(
			error.response?.data?.detail ||
				"Error al actualizar el estado de la tarea"
		);
	}
}

export async function fetchTaskStates(token) {
	const res = await api.get("/task-states/", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (res.status !== 200) throw new Error("Error al obtener estados de tarea");
	return res.data;
}

export async function fetchTasksByProject(projectId, token) {
	const res = await api.get(`/tasks/by-project/${projectId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (res.status !== 200) {
		throw new Error("Error al obtener tareas del proyecto");
	}
	return res.data; // array de tareas
}

export async function createTask(data, token) {
	const res = await api.post(
		"/tasks/",

		data,

		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

export async function assignTaskUser(data, token) {
	const res = await api.patch(`/tasks/assign-user/`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return res.data;
}

export async function fetchProjectMembers(projectId, token) {
	const res = await api.get(`/projects/${projectId}/members/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}
