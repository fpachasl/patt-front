import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MetricsCard({ title, value, color = "text-foreground" }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className={`text-2xl font-semibold ${color}`}>{value}</p>
			</CardContent>
		</Card>
	);
}