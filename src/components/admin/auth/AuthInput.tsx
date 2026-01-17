interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: string;
}

export function AuthInput({ label, icon, className, ...props }: AuthInputProps) {
    return (
        <div>
            <label
                htmlFor={props.id}
                className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1.5"
            >
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">
                        {icon}
                    </span>
                </div>
                <input
                    {...props}
                    className={`block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-text-main dark:text-white bg-gray-50 dark:bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow ${className}`}
                />
            </div>
        </div>
    );
}
