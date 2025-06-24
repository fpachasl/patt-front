import {
	Bell,
	FolderKanban,
	ListTodo,
	Files,
	LogOut,
	User,
	User2,
	ChevronUp,
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
		url: "#",
		icon: Bell,
	},
	{
		title: "Documentos",
		url: "#",
		icon: Files,
	},
	{
		title: "Cerrar Sesión",
		url: "#",
		icon: LogOut,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<Link href={"/menu"} className="w-32 h-full m-2">
						<img
							src="/pattern-black.png"
							alt="Pattern Black"
						/>
					</Link>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title} className="mt-1">
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span className="text-base">{item.title}</span>
										</a>
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
