"use client";

import { Heart as Like } from "lucide-react";

export function Heart({ hasLiked }: { hasLiked: boolean }) {
    return (
        <Like
            size={20}
            className={`group-hover:text-red-500 ${hasLiked ? "fill-current text-red-500" : "fill-none"}`}
        />
    );
}
