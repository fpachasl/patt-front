"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export function AuthGuard({ children }) {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="h-screen w-screen flex flex-col items-center justify-center  px-6">
				<div className="w-full max-w-2xl space-y-6">
					<Skeleton className="h-10 w-full rounded-xl bg-gray-300" />
					<Skeleton className="h-6 w-5/6 rounded bg-gray-300" />
					<Skeleton className="h-6 w-3/4 rounded bg-gray-300" />
					<Skeleton className="h-6 w-4/6 rounded bg-gray-300" />
					<Skeleton className="h-40 w-full rounded-xl bg-gray-300" />
				</div>
			</div>
		);
	}

	return children;
}
