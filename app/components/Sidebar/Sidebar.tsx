import Link from "next/link";
import { PostModal } from "./PostModal";
import { Home as HomeIcon } from "./Icons/Home";
import { ExploreIcon } from "./Icons/Explore";
import { NotificationsIcon } from "./Icons/Notifications";
import { MessagesIcon } from "./Icons/Messages";
import { BookmarksIcon } from "./Icons/Bookmarks";
import { ProfileIcon } from "./Icons/Profile";
import { LogoutIcon } from "./Icons/Logout";
import { logout } from "./actions/logout";

type SidebarProps = {
    name: string;
    username: string;
    avatar: string;
    unreadNotifications: number;
    unreadMessages: number;
};

export function Sidebar({
    name,
    username,
    avatar,
    unreadMessages,
    unreadNotifications,
}: SidebarProps) {
    return (
        <>
            <aside className="fixed h-screen w-64 flex flex-col p-4 border-r border-gray-200 dark:border-gray-800">
                <nav className="flex-1 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <HomeIcon />
                        <span className="ml-4">Home</span>
                    </Link>
                    <Link
                        href="/explore"
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ExploreIcon />
                        <span className="ml-4">Explore</span>
                    </Link>
                    <Link
                        href="/notifications"
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <NotificationsIcon />
                        <span className="ml-4 flex items-center">
                            Notifications
                            {unreadNotifications > 0 && (
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {unreadNotifications}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link
                        href="/messages"
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <MessagesIcon />
                        <span className="ml-4 flex items-center">
                            Messages
                            {unreadMessages > 0 && (
                                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                                    {unreadMessages}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link
                        href="/bookmarks"
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <BookmarksIcon />
                        <span className="ml-4">Bookmarks</span>
                    </Link>
                    <Link
                        className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        href={`/${username}`}
                    >
                        <ProfileIcon />
                        <span className="ml-4">Profile</span>
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                        >
                            <span className="flex pl-0.5">
                                <LogoutIcon />
                            </span>
                            <span className="ml-3.5">Sign out</span>
                        </button>
                    </form>
                </nav>
                <PostModal />
                <Link
                    href={`/${username}`}
                    className="flex items-center w-full rounded-full p-3 mt-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                    type="button"
                >
                    <img
                        src={avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3 text-left">
                        <div className="font-bold text-gray-900 dark:text-white">
                            {name}
                        </div>
                        <div className="text-gray-500">@{username}</div>
                    </div>
                </Link>
            </aside>
        </>
    );
}
