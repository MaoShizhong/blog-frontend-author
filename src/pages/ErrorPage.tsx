import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function ErrorPage() {
    useEffect((): (() => void) => {
        document.title = 'BLOG CMS';

        document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href = '/dotless_favicon.ico';

        return (): void => {
            document.title = '.BLOG CMS';
            document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href = '/favicon.ico';
        };
    }, []);

    return (
        <main className="grid min-h-screen place-content-center">
            <div className="flex flex-col items-center max-w-md gap-2 text-center" style={{}}>
                <h1 className="text-5xl font-bold">BLOG</h1>
                <p className="text-xl">Oh no!</p>
                <p>Something went wrong and the blog has lost its dot!</p>
                <p>You can try and restore it by clicking below to return to the homepage:</p>
                <Link
                    to="/"
                    className="mt-4 text-2xl font-bold transition motion-safe:animate-bounce hover:text-zinc-500"
                >
                    {'>'} Restore the dot {'<'}
                </Link>
            </div>
        </main>
    );
}
