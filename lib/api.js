import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor para respuestas exitosas
api.interceptors.response.use(
	(response) => {
		//console.log("[API ✅]: Response OK", response.config.url, response.status);
		return response;
	},
	(error) => {
		// Si es un error de autenticación
		if (error.response?.status === 401 && typeof window !== "undefined") {
			console.warn("[API ⚠️]: Unauthorized - Redirigiendo al login...");
			window.location.href = "/";
		} else {
			// console.error(
			// 	"[API ❌]: Error en la respuesta",
			// 	error.response?.status,
			// 	error.config?.url
			// );
		}
		return Promise.reject(error);
	}
);

// Interceptor para agregar logs de cada request (opcional pero útil)
api.interceptors.request.use(
	(config) => {
		//console.log("[API 🔄]: Request", config.method?.toUpperCase(), config.url);
		return config;
	},
	(error) => {
		//console.error("[API ❌]: Error al hacer la request", error);
		return Promise.reject(error);
	}
);

export default api;
