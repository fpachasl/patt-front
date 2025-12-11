import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        const res = await fetch("http://18.188.64.78/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: "Invalid credentials", detail: data }, { status: 401 });
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Proxy error", detail: err.message }, { status: 500 });
    }
}
