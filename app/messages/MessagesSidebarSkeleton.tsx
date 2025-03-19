import { Search } from "lucide-react";

export function MessagesSidebarSkeleton() {
    const skeletonItems = Array(5).fill(null);

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>

                <div className="relative">
                    <div className="w-full h-10 pl-10 pr-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {skeletonItems.map((_, index) => (
                    <div
                        key={index}
                        className="flex p-4 border-b border-gray-200 dark:border-gray-800"
                    >
                        {/* Avatar skeleton */}
                        <div className="relative mr-4">
                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                                {/* Username skeleton */}
                                <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                                {/* Timestamp skeleton */}
                                <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            {/* Message text skeleton */}
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
