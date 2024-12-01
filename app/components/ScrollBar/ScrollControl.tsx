"use client";

import { useEffect } from "react";

export function ScrollControl({ disableScroll }: { disableScroll: boolean }) {
    useEffect(() => {
        if (disableScroll) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [disableScroll]);

    return null;
}
