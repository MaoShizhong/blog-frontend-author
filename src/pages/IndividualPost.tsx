import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Post } from './Posts';
import sanitizeHTML from 'sanitize-html';
import { getFetchOptions } from '../helpers/form_options';

export function IndividualPost() {
    const { post } = useLocation().state;

    const [currentPost, setCurrentPost] = useState(post as Post);
    const [askConfirmDelete, setAskConfirmDelete] = useState(false);

    const { username, redirectToLogin } = useContext(UserContext);

    const navigateTo = useNavigate();

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    async function handlePublish(isToBePublished: boolean): Promise<void> {
        try {
            const res = await fetch(
                `http://localhost:5000/posts/${currentPost._id}?publish=${isToBePublished}`,
                getFetchOptions('PATCH')
            );

            if (res.ok) {
                setCurrentPost(await res.json());
            } else {
                const refreshRes = await fetch(
                    'http://localhost:5000/auth/refresh',
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `http://localhost:5000/posts/${currentPost._id}?publish=${isToBePublished}`,
                        getFetchOptions('PATCH')
                    );
                    if (retryRes.ok) {
                        setCurrentPost(await retryRes.json());
                    }
                } else {
                    redirectToLogin();
                }
            }
        } catch (error) {
            console.error(error);
        }

        // reset 'CONFIRM DELETE' button to 'Delete post' if previously clicked
        setAskConfirmDelete(false);
    }

    async function deletePost(): Promise<void> {
        try {
            const res = await fetch(
                `http://localhost:5000/posts/${currentPost._id}`,
                getFetchOptions('DELETE')
            );

            if (res.ok) {
                navigateTo('/posts', { replace: true });
            } else {
                const refreshRes = await fetch(
                    'http://localhost:5000/auth/refresh',
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `http://localhost:5000/posts/${currentPost._id}`,
                        getFetchOptions('DELETE')
                    );
                    if (retryRes.ok) {
                        navigateTo('/posts', { replace: true });
                    }
                } else {
                    redirectToLogin();
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="flex-1 px-2 py-8 sm:p-10 w-form">
            <div className="flex flex-col items-center gap-3 mb-4">
                <div className="flex gap-10 sm:gap-28">
                    {!currentPost.isPublished && askConfirmDelete ? (
                        <button
                            className="font-bold transition hover:text-slate-600"
                            onClick={deletePost}
                        >
                            CONFIRM DELETE
                        </button>
                    ) : !currentPost.isPublished ? (
                        <button
                            className="transition hover:text-slate-600"
                            onClick={(): void => setAskConfirmDelete(true)}
                        >
                            Delete post
                        </button>
                    ) : null}
                    <Link
                        to="edit"
                        className="transition hover:text-slate-600"
                        state={{ postToEdit: currentPost }}
                    >
                        Edit post
                    </Link>
                    {currentPost.isPublished ? (
                        <button
                            className="transition hover:text-slate-600"
                            onClick={(): Promise<void> => handlePublish(false)}
                        >
                            Unpublish post
                        </button>
                    ) : (
                        <button
                            className="transition hover:text-slate-600"
                            onClick={(): Promise<void> => handlePublish(true)}
                        >
                            Publish post
                        </button>
                    )}
                </div>
                {currentPost.isPublished && (
                    <a href={currentPost.url} className="transition hover:text-slate-600">
                        <button>
                            {'>'} Link to published post {'<'}
                        </button>
                    </a>
                )}
            </div>

            <article>
                <h1 className="text-4xl font-bold text-center">{currentPost.title}</h1>
                <p className="italic text-center">Written by {currentPost.author.name}</p>
                <p className="mb-8 italic text-center">
                    {currentPost.isPublished ? 'Published on ' : 'Unpublished - '}
                    {new Date(currentPost.timestamp).toDateString()}
                </p>

                <section>
                    {currentPost.text.map(
                        (paragraph: string, i: number): JSX.Element => (
                            <p
                                key={i}
                                className="my-4 break-words whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(paragraph) }}
                            />
                        )
                    )}
                </section>
            </article>
        </main>
    );
}
