import { useEffect, useState } from "react";
import { fetchRecentActivity } from "@/lib/services/dashboard";

export default function RecentActivity({ token }) {
	const [activity, setActivity] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			fetchRecentActivity(token)
				.then((data) => {
					setActivity(data);
					setLoading(false);
				})
				.catch((error) => {
					console.error(error);
					setLoading(false);
				});
		}
	}, [token]);

	if (loading) {
		return (
			<ul className="text-sm space-y-3 text-muted-foreground">
				<li>Cargando actividad...</li>
			</ul>
		);
	}

	if (activity.length === 0) {
		return (
			<ul className="text-sm space-y-3 text-muted-foreground">
				<li>No hay actividad reciente.</li>
			</ul>
		);
	}

	return (
		<ul className="text-sm space-y-3 text-muted-foreground">
			{activity.map((item) => (
				<li key={item.id}>
					{item.message}{" "}
					{item.task_title && (
						<span className="font-semibold">"{item.task_title}"</span>
					)}
					<br />
					<span className="text-xs text-gray-500">
						{new Date(item.send_date).toLocaleString()}
					</span>
				</li>
			))}
		</ul>
	);
}
