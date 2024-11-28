import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import NextImage from "next/image";

type PhotoModalProps = {
    photo: { url: string; id?: string } | null;
    onClose: () => void;
    timestamp: string;
};

export function ImagePreview({ photo, onClose, timestamp }: PhotoModalProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (photo) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [photo, onClose]);

    useEffect(() => {
        if (photo) {
            const img = new Image();
            img.onload = () => {
                setImageDimensions({ width: img.width, height: img.height });
                setImageLoaded(true);
            };
            img.src = photo.url;
        }
    }, [photo]);

    function getImageClassName() {
        if (!imageLoaded) return "opacity-0";

        const isWide = imageDimensions.width > imageDimensions.height;
        return isWide
            ? "w-full h-auto object-contain"
            : "w-auto max-h-[80vh] mx-auto object-contain";
    }

    if (!photo) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                    <X size={32} />
                </button>
                <div className="max-h-[80vh] w-full flex items-center justify-center overflow-auto">
                    <NextImage
                        ref={imageRef}
                        src={photo.url}
                        alt={`Full view of photo ${photo.id}`}
                        layout="intrinsic"
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                        className={getImageClassName()}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                <div className="mt-4 text-center text-white">
                    <p>{timestamp}</p>
                </div>
            </div>
        </div>
    );
}
