import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AccountHandler } from './pages/AccountHandler';
import { Posts } from './pages/Posts';
import { Post } from './pages/Post';
import { NewPost } from './pages/NewPost';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/login', element: <AccountHandler loginType="login" /> },
            { path: '/signup', element: <AccountHandler loginType="signup" /> },
            { path: '/posts', element: <Posts /> },
            { path: '/posts/:id', element: <Post /> },
            { path: '/posts/new', element: <NewPost /> },
        ],
    },
]);
