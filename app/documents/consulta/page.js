"use client";
import RagComponent from "@/components/pages/DocumentsComponent/RagComponent";
import { useSession } from "next-auth/react";

export default function RagDocuments() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return <RagComponent token={token} />;
}
