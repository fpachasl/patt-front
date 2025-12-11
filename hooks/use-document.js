"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { fetchUserDocuments } from "@/lib/services/documents";

export function usePaginatedDocuments() {
	const { data: session } = useSession();

	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrev, setHasPrev] = useState(false);

	const topRef = useRef(null);

	useEffect(() => {
		if (!session?.accessToken) return;

		setLoading(true);

		fetchUserDocuments(session.accessToken, page)
			.then((data) => {
				setDocuments(data.results);
				setTotalPages(data.total_pages || 1);
				setCurrentPage(data.current_page || 1);
				setHasNext(!!data.next);
				setHasPrev(!!data.previous);

				setTimeout(() => {
					topRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 100);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [session, page]);

	function nextPage() {
		if (hasNext) setPage((p) => p + 1);
	}

	function prevPage() {
		if (hasPrev) setPage((p) => Math.max(p - 1, 1));
	}

	return {
		documents,
		loading,
		error,
		page,
		currentPage,
		totalPages,
		hasNext,
		hasPrev,
		nextPage,
		prevPage,
		topRef,
	};
}
