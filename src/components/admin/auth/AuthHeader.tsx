import Link from "next/link";

export function AuthHeader() {
    return (
        <div className="w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none fixed top-0 z-50">
            <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-6 py-3 flex items-center justify-between gap-8 max-w-4xl w-full">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-sm group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-lg">
                            data_object
                        </span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-text-main dark:text-white">
                        Sarah Jenkins
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    <a
                        href="#"
                        className="text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                        Help
                    </a>
                </nav>
            </header>
        </div>
    );
}
