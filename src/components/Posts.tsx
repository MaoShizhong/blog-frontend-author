import { useContext, useEffect } from 'react';
import { UserContext } from '../App';

export function Posts() {
    const { username, redirectToLogin } = useContext(UserContext);

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    return <div>Posts</div>;
}
