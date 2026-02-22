"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InViewAnimationProps {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
}

export default function InViewAnimation({
    children,
    delay = 0,
    direction = "up",
    className = ""
}: InViewAnimationProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
        none: { x: 0, y: 0 }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction]
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 1,
                delay,
                ease: [0.21, 0.45, 0.32, 0.9]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
