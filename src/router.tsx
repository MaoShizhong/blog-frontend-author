import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AccountHandler } from './pages/AccountHandler';
import { Posts } from './pages/Posts';
import { IndividualPost } from './pages/IndividualPost';
import { PostForm } from './pages/PostForm';
import { ErrorPage } from './pages/ErrorPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <AccountHandler loginType="login" /> },
            { path: '/error', element: <ErrorPage /> },
            { path: '/login', element: <AccountHandler loginType="login" /> },
            { path: '/signup', element: <AccountHandler loginType="signup" /> },
            { path: '/posts', element: <Posts /> },
            { path: '/posts/:postID', element: <IndividualPost /> },
            { path: '/posts/:postID/edit', element: <PostForm key={1} /> },
            { path: '/posts/new', element: <PostForm key={2} /> },
        ],
        errorElement: <ErrorPage />,
    },
]);
