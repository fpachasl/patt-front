"use client";
import DocumentsComponent from "@/components/pages/DocumentsComponent";
import { useSession } from "next-auth/react";

export default function Documents() {
	const { data: session } = useSession();
	const token = session?.accessToken;

	return <DocumentsComponent token={token} />;
}
