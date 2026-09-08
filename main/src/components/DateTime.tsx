'use client';

import { cn } from '@/src/lib/utils';
import { useEffect, useRef } from 'react';

function RealTimeClock() {
    const timeRef = useRef<HTMLSpanElement>(null);
    const dateRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const formatTime = (now: Date) => {
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const hoursStr = hours.toString().padStart(2, '0');
            return `${hoursStr}:${minutes} ${ampm}`;
        };

        const formatDate = (now: Date) =>
            now
                .toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                })
                .replace(',', '');

        const updateDOM = () => {
            const now = new Date();
            if (timeRef.current) timeRef.current.textContent = formatTime(now);
            if (dateRef.current) dateRef.current.textContent = formatDate(now);
        };

        updateDOM();

        // sync to next minute boundary, then tick every 60s
        const msToNextMinute = 60000 - (Date.now() % 60000);
        let intervalId: ReturnType<typeof setInterval>;

        const timeoutId = setTimeout(() => {
            updateDOM();
            intervalId = setInterval(updateDOM, 60000);
        }, msToNextMinute);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={cn("")}>
            <span ref={dateRef} />
            <span ref={timeRef} style={{ marginLeft: 8 }} />
        </div>
    );
}

export default RealTimeClock;