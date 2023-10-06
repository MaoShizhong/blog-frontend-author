type LoadingProps = { text: string };

export function Loading({ text }: LoadingProps) {
    return (
        <div className="flex items-center gap-2 mt-20">
            <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                className="motion-safe:animate-spin"
            >
                <path
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity=".25"
                />
                <circle cx="12" cy="2.5" r="1.5" />
            </svg>
            <p className="text-lg motion-safe:animate-pulse">{text}</p>
        </div>
    );
}
