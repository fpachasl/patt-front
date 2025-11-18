"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchUserDocuments } from "@/lib/services/documents";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DocumentsComponent() {
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

				// Hacer scroll al inicio
				setTimeout(() => {
					topRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 100);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [session, page]);

	const handleNext = () => setPage((prev) => prev + 1);
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className="py-8 px-4">
			<div ref={topRef} />
			<h1 className="text-2xl font-bold mb-4">Documentos</h1>

			{loading ? (
				<p>Cargando documentos...</p>
			) : error ? (
				<p className="text-red-500">Error: {error}</p>
			) : documents.length === 0 ? (
				<p>No hay documentos disponibles.</p>
			) : (
				<>
					<table className="w-full text-left border">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2">Nombre</th>
								<th className="p-2">Proyecto</th>
								<th className="p-2">Tipo</th>
								<th className="p-2">Subido el</th>
								<th className="p-2">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{documents.map((doc) => (
								<tr key={doc.id} className="border-t">
									<td className="p-2">{doc.name}</td>
									<td className="p-2">{doc.project.name}</td>
									<td className="p-2">{doc.document_type.name}</td>
									<td className="p-2">
										{new Date(doc.upload_date).toLocaleString()}
									</td>
									<td className="p-2">
										<a
											href={doc.file}
											className="text-blue-500 hover:underline"
											target="_blank"
											rel="noopener noreferrer">
											Descargar
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Paginación */}
					<div className="flex items-center justify-center gap-4 mt-6">
						<button
							onClick={handlePrev}
							disabled={!hasPrev}
							className={`p-2 cursor-pointer rounded-full ${
								hasPrev
									? "bg-blue-500 text-white"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}>
							<ChevronLeft size={20} />
						</button>

						<span className="text-sm text-gray-700">
							Página <strong>{currentPage}</strong> de{" "}
							<strong>{totalPages}</strong>
						</span>

						<button
							onClick={handleNext}
							disabled={!hasNext}
							className={`p-2 cursor-pointer rounded-full ${
								hasNext
									? "bg-blue-500 text-white"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}>
							<ChevronRight size={20} />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
