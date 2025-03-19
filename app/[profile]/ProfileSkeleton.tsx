export function ProfileSkeleton() {
    return (
        <div className="flex-1 flex justify-center">
            <main
                id="profile-skeleton-container"
                className="w-full max-w-3xl px-4 py-4 mb-16 md:mb-0"
            >
                <div className="bg-white rounded-lg shadow-md dark:bg-foreground animate-pulse">
                    {/* Header with avatar and username */}
                    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        {/* Avatar skeleton */}
                        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <div className="ml-4 flex-1">
                            {/* Name skeleton */}
                            <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            {/* Username skeleton */}
                            <div className="h-5 w-24 mt-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Edit profile button skeleton */}
                        <div className="ml-auto h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Bio skeleton */}
                    <div className="p-4 text-gray-700 dark:text-gray-300">
                        <div className="h-16 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Posts section */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="h-8 w-48 mb-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div id="posts-skeleton-container">
                            {/* Post skeletons - reusing your existing PostSkeleton component */}
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-md p-4 dark:border-gray-700">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                        <div className="ml-3">
                                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-3 w-16 mt-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-md p-4 dark:border-gray-700">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                        <div className="ml-3">
                                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                            <div className="h-3 w-16 mt-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
