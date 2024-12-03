import React from "react";

export function PostSkeleton() {
    return (
        <div className="xs:w-30 max-w-xl mx-auto bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4 my-4 animate-pulse">
            <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col space-y-2">
                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>

                    <div className="mt-3 mb-3">
                        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>

                    <div className="flex items-center justify-start space-x-10 mt-3">
                        <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
