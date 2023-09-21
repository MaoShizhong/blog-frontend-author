import { useContext, useEffect } from 'react';
import { UserContext } from '../App';

export function SignUp() {
    const { username, redirectToPosts } = useContext(UserContext);

    useEffect((): void => {
        if (username) redirectToPosts();
    }, [username, redirectToPosts]);

    return <div>SignUp</div>;
}
