/* eslint-disable @next/next/no-img-element */
import useTranslation from "next-translate/useTranslation";
import Link from 'next/link';
import { ThemeSwitcher } from "./theme-switcher";
import { ClearDataButton } from "./ui/clear-data-button";

export default function HeaderComponent() {
    const { t, lang } = useTranslation('common');
    return (
        <header className="h-[64px] py-[10px] px-[20px] flex justify-between fixed top-0 left-0 w-[100dvw] bg-transparent z-[1000] backdrop-blur-[20px]">
            <Link href="/" className="flex items-center text-center opacity-80 gap-1 hover:opacity-100 hover:translate-x-[10px] transition-all">
                <img src="/icon.png" alt="Logo" className="h-[100%] dark:invert opacity-80 drag-none select-none" />
                <h1 className={"hidden md:inline-block xl:inline-block lg:inline-block sm:inline-block text-3xl font-bold text-foreground whitespace-nowrap select-none"}>{t('app.title')}</h1>
            </Link>
            <div className="flex">
                <ClearDataButton />
                <ThemeSwitcher />
            </div>
        </header>
    );
}