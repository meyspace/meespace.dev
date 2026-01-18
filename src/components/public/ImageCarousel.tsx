"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
    images: { url: string; alt?: string; caption?: string }[];
    className?: string;
}

export function ImageCarousel({ images, className = "" }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className={`relative w-full ${className}`}>
            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                    src={images[currentIndex].url}
                    alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />

                {/* Navigation Arrows - inside container */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 dark:bg-black/70 shadow-lg flex items-center justify-center text-text-main dark:text-white hover:bg-white dark:hover:bg-black transition-colors cursor-pointer z-10"
                            aria-label="Previous image"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            onClick={goToNext}
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 dark:bg-black/70 shadow-lg flex items-center justify-center text-text-main dark:text-white hover:bg-white dark:hover:bg-black transition-colors cursor-pointer z-10"
                            aria-label="Next image"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </>
                )}

                {/* Counter - inside container */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-xs font-medium z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Caption */}
                {images[currentIndex].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                        <p className="text-white text-sm">{images[currentIndex].caption}</p>
                    </div>
                )}
            </div>

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentIndex
                                ? 'bg-primary-dark w-6'
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Thumbnails (for galleries with 3+ images) */}
            {images.length >= 3 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden relative cursor-pointer transition-all ${index === currentIndex
                                ? 'ring-2 ring-primary-dark ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                                : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
