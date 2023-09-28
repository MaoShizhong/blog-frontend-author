import { Header } from './components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { fetchData } from './helpers/form_options';

type User = string | null;

type AuthRouteFunctions = {
    redirectToLogin: () => void;
    redirectToPosts: (user?: User) => void;
    refreshAccessToken: () => Promise<void>;
};

export const UserContext = createContext<{ username: User } & AuthRouteFunctions>({
    username: null,
    redirectToLogin: (): void => {},
    redirectToPosts: (): void => {},
    refreshAccessToken: async (): Promise<void> => {},
});

export function App() {
    const [user, setUser] = useState<User>(null);

    const navigateTo = useNavigate();

    // needed to maintain login on refresh (cannot directly access httpOnly cookies)
    useEffect((): void => {
        refreshAccessToken();
        // disabled as adding dependency causes infinite requests - specifically on need to run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function redirectToLogin(): void {
        setUser(null);
        navigateTo('/login', { replace: true });
    }

    // param only received when logging in to set username for future redirects until logout
    function redirectToPosts(username?: User): void {
        if (username) {
            setUser(username);
        }
        navigateTo('/posts', { replace: true });
    }

    async function refreshAccessToken(): Promise<void> {
        const res = await fetchData('/auth/tokens', 'PUT');

        if (res instanceof Error) {
            navigateTo('/error');
        } else if (!res.ok) {
            // Force log out if no valid refresh token
            redirectToLogin();
        } else {
            const { username } = await res.json();
            redirectToPosts(username);
        }
    }

    return (
        <UserContext.Provider
            value={{
                username: user,
                redirectToLogin,
                redirectToPosts,
                refreshAccessToken,
            }}
        >
            <Header />
            <Outlet />
        </UserContext.Provider>
    );
}
