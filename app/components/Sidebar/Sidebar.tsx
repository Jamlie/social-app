import Link from "next/link";
import { PostModal } from "./PostModal";
import { logout } from "./actions/logout";
import {
    Bell,
    Bookmark,
    Hash,
    House,
    LogOut,
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

export function Sidebar({
    userId,
    username,
    unreadMessages,
    unreadNotifications,
}: SidebarProps) {
    return (
        <>
            <aside className="fixed h-screen w-64 flex flex-col p-4 border-r border-gray-200 dark:border-gray-800">
                <nav className="flex-1 space-y-1">
                    <Link href="/" className="sidebar-link">
                        <House />
                        <span className="ml-4">Home</span>
                    </Link>
                    <Link href="/explore" className="sidebar-link">
                        <Hash />
                        <span className="ml-4">Explore</span>
                    </Link>
                    <Link href="/notifications" className="sidebar-link">
                        <Bell />
                        <span className="ml-4 flex items-center">
                            Notifications
                            {unreadNotifications > 0 && (
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {unreadNotifications}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link href="/messages" className="sidebar-link">
                        <Mail />
                        <span className="ml-4 flex items-center">
                            Messages
                            {unreadMessages > 0 && (
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {unreadMessages}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link href="/bookmarks" className="sidebar-link">
                        <Bookmark />
                        <span className="ml-4">Bookmarks</span>
                    </Link>
                    <Link className="sidebar-link" href={`/${username}`}>
                        <UserRound />
                        <span className="ml-4">Profile</span>
                    </Link>
                    <DarkModeToggle />
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
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
