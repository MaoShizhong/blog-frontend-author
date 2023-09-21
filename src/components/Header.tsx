import { NavLink, useLocation } from 'react-router-dom';

export function Header() {
    const { pathname } = useLocation();

    return (
        <header className="flex items-center justify-between gap-8 p-2 border-b shadow-md sm:justify-center">
            <a href="/">
                <button className="text-4xl font-bold">BLOG.</button>
            </a>
            <nav className="flex gap-4">
                {pathname === '/login' ? (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signup">Sign up</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/posts">All Posts</NavLink>
                        <NavLink to="/posts/new">New Post</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}
