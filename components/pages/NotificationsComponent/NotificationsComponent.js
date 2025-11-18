"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchAllNotifications } from "@/lib/services/notifications";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NotificationsComponent() {
	const { data: session } = useSession();
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrev, setHasPrev] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);

	const listTopRef = useRef(null); // referencia al inicio de la lista

	useEffect(() => {
		if (!session?.accessToken) return;

		setLoading(true);
		fetchAllNotifications(session.accessToken, page)
			.then((data) => {
				setNotifications(data.results);
				setHasNext(!!data.next);
				setHasPrev(!!data.previous);
				setTotalPages(data.total_pages || 1);
				setCurrentPage(data.current_page || 1);
				// Desplazamiento automático al inicio
				setTimeout(() => {
					listTopRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 100); // pequeño delay para asegurar que el contenido ya esté renderizado
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [session, page]);

	const handleNext = () => setPage((prev) => prev + 1);
	const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className="max-w-3xl py-8 px-4">
			<div ref={listTopRef} />{" "}
			{/* Esto es lo que usaremos como ancla para el scroll */}
			<h1 className="text-2xl font-bold mb-2">Notificaciones</h1>
			<p className="text-gray-600 mb-6">
				Estas son tus notificaciones más recientes:
			</p>
			{loading ? (
				<p>Cargando...</p>
			) : error ? (
				<p className="text-red-500">Error: {error}</p>
			) : notifications.length === 0 ? (
				<p>No tienes notificaciones aún.</p>
			) : (
				<>
					<ul className="space-y-4">
						{notifications.map((n) => (
							<li
								key={n.id}
								className={`border rounded-lg p-4 shadow-sm ${
									n.is_read ? "bg-white" : "bg-blue-50"
								}`}>
								<p className="text-sm text-gray-800">{n.message}</p>
								
								<p className="text-xs text-gray-400 mt-2">
									{new Date(n.send_date).toLocaleString()}
								</p>
							</li>
						))}
					</ul>

					{/* Controles de paginación con íconos y número de página */}
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
