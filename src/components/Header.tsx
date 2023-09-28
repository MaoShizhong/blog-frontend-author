import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../App';
import { useContext } from 'react';
import { fetchData } from '../helpers/form_options';

export function Header() {
    const { username, redirectToLogin } = useContext(UserContext);

    async function logout(): Promise<void> {
        await fetchData('/auth/tokens', 'DELETE');
        redirectToLogin();
    }

    return (
        <header className="sticky top-0 z-10 flex items-center justify-center w-full gap-8 px-3 py-3 bg-white border-b shadow-md">
            <div className="flex items-center justify-between w-form">
                <div className="flex items-center gap-2">
                    <Link
                        to={username ? '/posts' : '/login'}
                        className="relative text-3xl font-bold select-none sm:text-4xl"
                    >
                        .BLOG
                        <p className="absolute right-0 text-xs -bottom-2.5">CMS</p>
                    </Link>
                    <a
                        href="https://github.com/MaoShizhong/dotBLOG-CMS"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            src="/github.png"
                            alt="github link"
                            className="w-8 transition sm:w-12 hover:scale-125"
                        />
                    </a>
                </div>

                {username && (
                    <h2 className="hidden text-lg select-none sm:block">Hello, {username}!</h2>
                )}

                <nav className="flex gap-4">
                    {username ? (
                        <>
                            <NavLink to="/posts" className="transition hover:text-slate-500">
                                Posts
                            </NavLink>
                            <NavLink
                                to="/posts/new"
                                state={{ postToEdit: null }}
                                className="transition hover:text-slate-500"
                            >
                                New Post
                            </NavLink>
                            <button className="transition hover:text-slate-500" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="transition hover:text-slate-500">
                                Login
                            </NavLink>
                            <NavLink to="/signup" className="transition hover:text-slate-500">
                                Sign up
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
