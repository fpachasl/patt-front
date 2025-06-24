// lib/services/dashboard.js
import api from "@/lib/api";

export const fetchDashboardData = async (token) => {
	try {
		const response = await api.get("/projects/dashboard/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener datos del dashboard:", error);
		throw error;
	}
};

export const fetchDashboardChartData = async (token) => {
	try {
		const res = await api.get(
			"/projects/dashboard-chart/",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return res.data;
	} catch (error) {
		console.error("Error al obtener datos del dashboard:", error);
		throw new Error("Error al obtener datos del gráfico");
	}
};

export const fetchRecentActivity = async (token) => {
	try {
		const response = await api.get("/notifications/recent/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener actividad reciente:", error);
		throw error;
	}
};
