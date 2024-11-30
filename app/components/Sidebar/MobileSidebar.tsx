import { Bookmark, Hash, House, LucideIcon, UserRound } from "lucide-react";
import Link from "next/link";

type SidebarLink = {
    href: string;
    icon: LucideIcon;
    name: string;
    badge?: number;
};

export function MobileSidebar({ username }: { username: string }) {
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
        <nav className="flex justify-around p-4">
            {links.map(({ href, icon: Icon, name }) => (
                <Link
                    key={name}
                    href={href}
                    className="text-gray-700 dark:text-gray-200"
                >
                    <Icon />
                </Link>
            ))}
        </nav>
    );
}
