import { cn } from '@/lib/utils';
import React from 'react'

function Ping({ children, color }: { children: React.ReactNode, color?: String }) {
    return (
        <>
            <div className={cn("flex justify-center items-center gap-1")}>


                <span className="relative flex h-1 w-1">
                    <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full  opacity-75",
                        `${color ?? "bg-green-500"}`
                    )}
                    />
                    <span className={cn("relative inline-flex h-1 w-1 rounded-full bg-green-500",
                        `${color ?? "bg-green-500"}`
                    )} />
                </span>
                {children}
            </div>
        </>

    )
}
export default Ping;