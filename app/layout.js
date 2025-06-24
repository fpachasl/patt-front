"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "@/lib/providers/providers";

export default function RootLayout({ children }) {
	const pathname = usePathname();

	// Si estamos en la página raíz (login), no mostrar sidebar
	const showSidebar = pathname !== "/";

	if (showSidebar) {
		return (
			<html lang="es">
				<body>
					<Providers>
						<SidebarProvider>
							<AppSidebar />
							<main className="flex-1 p-4">
								<SidebarTrigger />
								{children}
							</main>
						</SidebarProvider>
					</Providers>
				</body>
			</html>
		);
	}

	// Para login ("/"), layout sin sidebar
	return (
		<html lang="es">
			<body>{children}</body>
		</html>
	);
}
