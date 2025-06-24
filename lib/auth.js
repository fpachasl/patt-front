// lib/auth.js
import api from "./api";

export async function loginUser(username, password) {
	return api.post("/token/", { username, password });
}
