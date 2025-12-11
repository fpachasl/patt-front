import axios from "axios";

const BACKEND_BASE = "http://18.188.64.78/api";

export async function GET(req, context) {
    return handleRequest("GET", req, await context.params);
}

export async function POST(req, context) {
    return handleRequest("POST", req, await context.params);
}

export async function PUT(req, context) {
    return handleRequest("PUT", req, await context.params);
}

export async function PATCH(req, context) {
    return handleRequest("PATCH", req, await context.params);
}

export async function DELETE(req, context) {
    return handleRequest("DELETE", req, await context.params);
}

async function handleRequest(method, req, params) {
    try {
        const { path = [] } = params;
        const backendUrl = `${BACKEND_BASE}/${path.join("/")}`;

        // console.log("[PROXY] Request →", method, backendUrl);

        // Parsear body solo si aplica
        let data = null;
        if (!["GET", "DELETE"].includes(method)) {
            data = await req.json().catch(() => undefined);
        }

        const authHeader = req.headers.get("authorization") || "";

        // console.log("[PROXY] Auth header:", authHeader);

        const response = await axios({
            method,
            url: backendUrl,
            data,
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
            validateStatus: () => true,
        });

        // console.log("[PROXY] Backend status:", response.status);
        // console.log("[PROXY] Backend data:", response.data);

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        // console.error("[PROXY ERROR]", error);
        // console.error("[PROXY ERROR - MESSAGE]", error.message);
        // console.error("[PROXY ERROR - RESPONSE]", error.response?.data);

        return new Response(
            JSON.stringify({
                error: "Proxy internal error",
                message: error.message,
                backend: error.response?.data || null,
            }),
            { status: 500 }
        );
    }
}

