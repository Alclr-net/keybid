import { cn } from "@/lib/utils";
import React from "react";

function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element {
    return (
        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", className)}>
            {children}
        </div>
    );
}

export default Container;