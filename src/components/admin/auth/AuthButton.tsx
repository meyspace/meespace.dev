interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function AuthButton({ children, className, ...props }: AuthButtonProps) {
    return (
        <button
            {...props}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-text-main dark:text-[#121715] bg-[#d0e6dc] hover:bg-[#b0c9be] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}
