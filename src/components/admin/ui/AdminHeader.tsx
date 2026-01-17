export function AdminHeader() {
    return (
        <header className="w-full h-16 bg-background-light dark:bg-background-dark flex items-center justify-between px-8 py-4 shrink-0">
            <div className="flex items-center text-sm text-text-muted dark:text-gray-400 font-medium">
                <span>Admin</span>
                <span className="material-symbols-outlined text-sm mx-2">
                    chevron_right
                </span>
                <span className="text-text-main dark:text-white font-semibold">
                    Overview
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-text-muted hover:text-text-main relative">
                    <span className="material-symbols-outlined">
                        notifications
                    </span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-white dark:hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                    <div className="size-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-200 text-xs flex items-center justify-center font-bold text-gray-500">
                        SJ
                    </div>
                    <span className="text-sm font-medium text-text-main dark:text-white hidden md:block">
                        Sarah Jenkins
                    </span>
                    <span className="material-symbols-outlined text-text-muted text-sm">
                        expand_more
                    </span>
                </div>
            </div>
        </header>
    );
}
