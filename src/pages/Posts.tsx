import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { Errors } from './AccountHandler';
import { ErrorList } from '../components/ErrorList';
import { fetchData } from '../helpers/form_options';
import htmlEntities from 'he';

type Author = {
    name: string;
    username: string;
};

type Category = 'javascript/typescript' | 'html' | 'css' | 'other';

export type Post = {
    _id: string;
    author: Author;
    title: string;
    imageURL?: string;
    imageCredit?: string;
    objectFit: string;
    timestamp: string;
    category: Category;
    text: string;
    isPublished: boolean;
    isFeatured: boolean;
    url: string;
};

export function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [errors, setErrors] = useState<Errors>(null);

    const { username, redirectToLogin } = useContext(UserContext);

    const navigateTo = useNavigate();

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    useEffect((): void => {
        (async (): Promise<void> => {
            const res = await fetchData('/posts', 'GET');

            if (res instanceof Error) {
                navigateTo('/error');
            } else if (!res.ok) {
                setErrors(await res.json());
            } else {
                setPosts(await res.json());
            }
        })();
    }, [navigateTo]);

    return (
        <main className="px-6 mt-10 bg-white border-2 sm:px-10 w-main drop-shadow-2xl border-slate-50 rounded-3xl">
            {errors && <ErrorList errors={errors} />}

            {posts.map((post, i) => (
                <article key={i} className="flex gap-2 my-6 sm:my-10">
                    <img
                        src={post.imageURL ?? '/default_article_icon.png'}
                        className="object-cover h-10 m-1 rounded-md aspect-square"
                    />
                    <div>
                        <Link
                            to={post._id}
                            state={{ post: post }}
                            className="text-3xl transition hover:text-slate-500"
                        >
                            {htmlEntities.decode(post.title)}
                        </Link>
                        <p className="text-sm italic">
                            {new Date(post.timestamp).toDateString()} -{' '}
                            {post.isPublished ? 'Published' : 'Unpublished'}
                        </p>
                        <p className="text-sm">
                            Category: <i>{post.category}</i>
                        </p>
                        <p>
                            By {post.author.name} ({post.author.username})
                        </p>
                    </div>
                </article>
            ))}
        </main>
    );
}
