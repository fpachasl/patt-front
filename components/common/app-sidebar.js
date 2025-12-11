import {
	Bell,
	FolderKanban,
	ListTodo,
	Files,
	LogOut,
	User,
	User2,
	ChevronUp,
	BookText,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";

const items = [
	{
		title: "Perfil",
		url: "/perfil",
		icon: User,
	},
	{
		title: "Mis proyectos",
		url: "/projects",
		icon: FolderKanban,
	},
	{
		title: "Mis tareas",
		url: "/task",
		icon: ListTodo,
	},
	{
		title: "Notificaciones",
		url: "/notifications",
		icon: Bell,
	},
	{
		title: "Documentos",
		url: "/documents",
		icon: Files,
	},
	{
		title: "Consulta Documentos",
		url: "/documents/consulta",
		icon: BookText
	},
	{
		title: "Cerrar Sesión",
		action: () => signOut({ callbackUrl: "/" }),
		icon: LogOut,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<Link href={"/menu"} className="w-32 h-full m-2">
						<img src="/pattern-black.png" alt="Pattern Black" />
					</Link>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title} className="mt-1 cursor-pointer">
									<SidebarMenuButton asChild>
										{item.url ? (
											<Link href={item.url}>
												<item.icon />
												<span className="text-base">{item.title}</span>
											</Link>
										) : (
											<button
												onClick={item.action}
												className="flex items-center gap-2 w-full text-left">
												<item.icon />
												<span className="text-base">{item.title}</span>
											</button>
										)}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
