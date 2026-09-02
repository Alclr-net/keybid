import React from 'react'
import { cn } from '@/lib/utils';

function Pannel({ children, className }: {
    children: React.ReactNode,
    className?: string
}): React.JSX.Element {
    return (
        <div
            className={cn(
                className,
                "relative rounded-3xl overflow-hidden",
                "bg-[linear-gradient(150deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.7)_35%,transparent_80%)]",
                " before:content-[''] before:absolute before:inset-0 before:m-[1] before:rounded-3xl before:bg-white",
            )}
        >
            <div className="relative rounded-3xl ">{children}</div>
        </div>

    );
}

export default Pannel