import { Header } from './components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';

type User = {
    username: string | null;
    accessToken: string | null;
};

type RedirectFunctions = {
    redirectToLogin: () => void;
    redirectToPosts: (user?: User) => void;
};

export const UserContext = createContext<User & RedirectFunctions>({
    username: null,
    accessToken: null,
    redirectToLogin: (): void => {},
    redirectToPosts: (): void => {},
});

export function App() {
    const [user, setUser] = useState<User>({ username: null, accessToken: null });

    const navigateTo = useNavigate();

    useEffect(() => {
        async function loginIfValidRefreshToken() {
            // Check if user is already logged in and has a valid refresh token
            // Refresh token in httpOnly cookie - cannot directly access here
            const res = await fetch('http://localhost:5000/auth/refresh');

            if (res.ok) {
                // Triggers only if status 200-299 i.e. valid refresh token found
                const accessToken = res.headers.get('authorization');
                const { username } = await res.json();

                setUser({ username, accessToken });
            } else {
                // Force log out if no valid refresh token
                await fetch('http://localhost:5000/auth/logout');
                setUser({ username: null, accessToken: null });
            }
        }

        loginIfValidRefreshToken();
    }, []);

    function redirectToLogin(): void {
        setUser({ username: null, accessToken: null });
        navigateTo('/login', { replace: true });
    }

    function redirectToPosts(user?: User): void {
        if (user) {
            setUser({ username: user.username, accessToken: user.accessToken });
        }
        navigateTo('/posts', { replace: true });
    }

    return (
        <UserContext.Provider
            value={{
                username: user.username,
                accessToken: user.accessToken,
                redirectToLogin,
                redirectToPosts,
            }}
        >
            <Header />
            <Outlet />
        </UserContext.Provider>
    );
}
