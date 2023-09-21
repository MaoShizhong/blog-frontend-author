import { useContext, useEffect } from 'react';
import { UserContext } from '../App';

export function Login() {
    const { username, redirectToPosts } = useContext(UserContext);

    useEffect((): void => {
        if (username) redirectToPosts();
    }, [username, redirectToPosts]);

    return <h1>LOGIN</h1>;
}
