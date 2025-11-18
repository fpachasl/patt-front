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
		throw new Error(
			error.response?.data?.detail || "Error al obtener el proyecto"
		);
	}
}

export async function fetchStateProject(token) {
	try {
		const res = await api.get(`/project-states/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.detail ||
				"Error al obtener los estados del proyecto"
		);
	}
}

export async function updateProject(data, token) {
	try {
		const res = await api.put(`/projects/update-project/`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.detail || "Error al actualizar el proyecto"
		);
	}
}

export async function fetchReportSumary(token) {
	try {
		const res = await api.get(`/projects/export-report/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			responseType: "blob",
		});

		// Descargar automáticamente
		const blob = new Blob([res.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "reporte_proyectos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		throw new Error(
			error.response?.data?.detail ||
				"Error al obtener el reporte de los proyectos"
		);
	}
}

export async function fetchReportKPIS(token) {
	try {
		const res = await api.get(`/projects/export-kpis/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			responseType: "blob",
		});

		// Descargar automáticamente
		const blob = new Blob([res.data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "reporte_proyectos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		throw new Error(
			error.response?.data?.detail ||
				"Error al obtener el reporte de los proyectos"
		);
	}
}
