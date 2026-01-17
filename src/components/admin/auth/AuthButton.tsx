interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function AuthButton({ children, className, ...props }: AuthButtonProps) {
    return (
        <button
            {...props}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-sage-green hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-green transition-colors duration-200 cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}
