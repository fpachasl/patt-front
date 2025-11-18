import api from "@/lib/api";

export async function fetchUserDocuments(token, pageOrUrl = 1) {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	if (typeof pageOrUrl === "number") {
		return api
			.get(`/documents/?page=${pageOrUrl}`, config)
			.then((res) => res.data);
	} else {
		return api.get(pageOrUrl, config).then((res) => res.data);
	}
}
