import { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom';
import sanitizeHTML from 'sanitize-html';

export function Post() {
    const { post } = useLocation().state;

    const { username, redirectToLogin } = useContext(UserContext);

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    return (
        <main className="flex-1 px-2 py-8 sm:p-10 w-form">
            {post.isPublished && (
                <a
                    href={post.url}
                    className="block mb-4 text-center transition hover:text-slate-600"
                >
                    <button>
                        {'>'} Link to published article {'<'}
                    </button>
                </a>
            )}

            <article>
                <h1 className="text-4xl font-bold text-center">{post.title}</h1>
                <p className="italic text-center">Written by {post.author.name}</p>
                <p className="mb-8 italic text-center">
                    {post.isPublished ? 'Published on ' : 'Unpublished - '}
                    {new Date(post.timestamp).toDateString()}
                </p>

                <section>
                    {post.text.map(
                        (paragraph: string, i: number): JSX.Element => (
                            <p
                                key={i}
                                className="my-4"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(paragraph) }}
                            />
                        )
                    )}
                </section>
            </article>
        </main>
    );
}
