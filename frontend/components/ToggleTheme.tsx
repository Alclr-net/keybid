import { cn } from '@/lib/utils';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
export const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();
    const handleThemeToggle = () => {
        console.log(theme)
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }
    return (
        <>
            <div className=" group size-15 flex justify-center items-center rounded-[14px] hover:cursor-pointer bg-violet-400/20 mx-[1]"
                onClick={handleThemeToggle}>
                <IconSun
                    stroke={1}


                    className={cn(
                        " text-zinc-700   dark:block hidden cursor-pointer size-5 fill-zinc-700 group-hover:fill-yellow-500 transition-all transition-duration-300"
                    )}
                />
                <IconMoon
                    stroke={1}

                    className={cn(
                        " text-zinc-700  dark:hidden block cursor-pointer size-5 fill-zinc-700 group-hover:fill-neutral-200 transition-all transition-duration-300"
                    )}
                /></div>
        </>

    )
}