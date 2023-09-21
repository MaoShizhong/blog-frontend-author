import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Posts } from './components/Posts';
import { Post } from './components/Post';
import { NewPost } from './components/NewPost';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <SignUp /> },
            { path: '/posts', element: <Posts /> },
            { path: '/posts/:id', element: <Post /> },
            { path: '/posts/new', element: <NewPost /> },
        ],
    },
]);
