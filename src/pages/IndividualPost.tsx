import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../App';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Post } from './Posts';
import sanitizeHTML from 'sanitize-html';
import { getFetchOptions } from '../helpers/form_options';
import htmlEntities from 'he';
import { API_DOMAIN } from '../helpers/domain';

export function IndividualPost() {
    const { post } = useLocation().state;

    const [currentPost, setCurrentPost] = useState(post as Post);
    const [askConfirmDelete, setAskConfirmDelete] = useState(false);

    const { username, redirectToLogin } = useContext(UserContext);

    const titleRef = useRef<HTMLHeadingElement>(null);

    const navigateTo = useNavigate();

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    // Bypasses Vite error when assigning `textWrap` property within JSX style object
    // (experimental CSS feature in Chrome 114+)
    useEffect((): void => {
        titleRef.current!.style.cssText = 'text-wrap: balance';
    }, []);

    async function handlePublish(isToBePublished: boolean): Promise<void> {
        try {
            const res = await fetch(
                `${API_DOMAIN}/${currentPost._id}?publish=${isToBePublished}`,
                getFetchOptions('PATCH')
            );

            if (res.ok) {
                setCurrentPost(await res.json());
            } else {
                const refreshRes = await fetch(
                    `${API_DOMAIN}/auth/refresh`,
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `${API_DOMAIN}/${currentPost._id}?publish=${isToBePublished}`,
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
                `${API_DOMAIN}/posts/${currentPost._id}`,
                getFetchOptions('DELETE')
            );

            if (res.ok) {
                navigateTo('/posts', { replace: true });
            } else {
                const refreshRes = await fetch(
                    `${API_DOMAIN}/auth/refresh`,
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `${API_DOMAIN}/posts/${currentPost._id}`,
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
        <main className="px-4 py-8 my-10 bg-white border-2 sm:px-14 w-main drop-shadow-2xl border-slate-50 rounded-3xl">
            <div className="max-w-4xl mx-auto">
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
                <article className="mb-24">
                    {/* textWrap not recognised but experimental in Chrome 114+ */}
                    <h1
                        className="mt-6 mb-4 text-3xl font-bold text-center sm:text-4xl"
                        ref={titleRef}
                    >
                        {currentPost.title}
                    </h1>
                    <p className="mb-8 italic text-center">
                        {currentPost.isPublished ? 'Published on ' : 'Unpublished - '}
                        {new Date(currentPost.timestamp).toDateString()} - Written by{' '}
                        {currentPost.author.name}
                    </p>
                    <section>
                        {currentPost.text.map(
                            (paragraph: string, i: number): JSX.Element => (
                                <p
                                    key={i}
                                    className="my-2 break-words whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHTML(htmlEntities.decode(paragraph), {
                                            allowedAttributes: { '*': ['style'] },
                                        }),
                                    }}
                                />
                            )
                        )}
                    </section>
                </article>
            </div>
        </main>
    );
}
