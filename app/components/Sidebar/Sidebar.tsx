import Link from "next/link";
import { PostModal } from "./PostModal";
import { logout } from "./actions/logout";
import {
    Bell,
    Bookmark,
    Hash,
    House,
    LogOut,
    LucideIcon,
    Mail,
    UserRound,
} from "lucide-react";
import { UserProfileLink } from "./UserProfileLink";
import { DarkModeToggle } from "./DarkModeToggle";

type SidebarProps = {
    userId: string;
    username: string;
    unreadNotifications: number;
    unreadMessages: number;
};

type SidebarLink = {
    href: string;
    icon: LucideIcon;
    name: string;
    badge?: number;
};

export function Sidebar({
    userId,
    username,
    unreadMessages,
    unreadNotifications,
}: SidebarProps) {
    const links: SidebarLink[] = [
        {
            href: "/",
            icon: House,
            name: "Home",
        },
        {
            href: "/explore",
            icon: Hash,
            name: "Explore",
        },
        {
            href: "/notifications",
            icon: Bell,
            name: "Notifications",
            badge: unreadNotifications,
        },
        {
            href: "/messages",
            icon: Mail,
            name: "Messages",
            badge: unreadMessages,
        },
        {
            href: "/bookmarks",
            icon: Bookmark,
            name: "Bookmarks",
        },
        {
            href: `/${username}`,
            icon: UserRound,
            name: "Profile",
        },
    ];

    return (
        <>
            <aside className="fixed h-screen w-64 flex flex-col p-4 border-r border-gray-200 dark:border-gray-800">
                <nav className="flex-1 space-y-1">
                    {links.map(({ href, icon: Icon, name, badge }) => (
                        <Link href={href} key={name} className="sidebar-link">
                            <Icon />
                            <span className="ml-4 flex items-center">
                                {name}
                                {badge && badge > 0 ? (
                                    <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                        {badge}
                                    </span>
                                ) : null}
                            </span>
                        </Link>
                    ))}

                    <DarkModeToggle />
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-background w-full"
                        >
                            <span className="flex pl-0.5">
                                <LogOut />
                            </span>
                            <span className="ml-3.5">Sign out</span>
                        </button>
                    </form>
                </nav>
                <PostModal />
                <UserProfileLink userId={userId} />
            </aside>
        </>
    );
}
