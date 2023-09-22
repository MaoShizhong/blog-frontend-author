import { Header } from './components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { getFetchOptions } from './helpers/form_options';

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

    useEffect((): void => {
        refreshAccessToken();
        console.clear();
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
        const res = await fetch('http://localhost:5000/auth/refresh', getFetchOptions('GET'));

        if (res.ok) {
            // Triggers only if status 200-299 i.e. valid refresh token found
            const { username } = await res.json();
            redirectToPosts(username);
        } else {
            // Force log out if no valid refresh token
            await fetch('http://localhost:5000/auth/logout');
            redirectToLogin();
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
