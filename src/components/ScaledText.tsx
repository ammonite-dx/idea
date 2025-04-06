"use client"

import React, { useRef, useState, useEffect } from "react";

export default function ScaledText ({ text }: { text:string }) {

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const adjustScale = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.scrollWidth;
                setScale(textWidth > containerWidth ? containerWidth / textWidth : 1);
            }
        };
        adjustScale();
        window.addEventListener("resize", adjustScale);
        return () => window.removeEventListener("resize", adjustScale);
    }, [text]);

    return (
        <div ref={containerRef} className="grow overflow-hidden whitespace-nowrap">
            <span ref={textRef} className="inline-block transform origin-left" style={{ transform: `scaleX(${scale})` }}>
                {text}
            </span>
        </div>
    );
};