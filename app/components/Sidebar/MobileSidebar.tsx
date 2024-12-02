import { Hash, House, LucideIcon, Mail, UserRound } from "lucide-react";
import Link from "next/link";

type SidebarLink = {
    href: string;
    icon: LucideIcon;
    name: string;
    badge?: number;
};

type Props = {
    username: string;
    unreadMessages: number;
};

export function MobileSidebar({ username, unreadMessages }: Props) {
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
            href: "/messages",
            icon: Mail,
            name: "Messages",
            badge: unreadMessages,
        },
        {
            href: `/${username}`,
            icon: UserRound,
            name: "Profile",
        },
    ];

    return (
        <nav className="flex justify-around p-4">
            {links.map(({ href, icon: Icon, name, badge }) => (
                <Link
                    key={name}
                    href={href}
                    className="relative flex flex-col items-center text-gray-700 dark:text-gray-200"
                >
                    <div className="relative">
                        <Icon />
                        {badge && badge > 0 ? (
                            <span className="left-3 bottom-2 absolute bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                                {badge}
                            </span>
                        ) : null}
                    </div>
                    <span className="text-sm">{name}</span>
                </Link>
            ))}
        </nav>
    );
}
