import { Post } from '../pages/Posts';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFetchOptions } from '../helpers/form_options';
import { API_DOMAIN } from '../helpers/domain';
import { UserContext } from '../App';

type PostButtonsProps = {
    currentPost: Post;
    setCurrentPost: Dispatch<SetStateAction<Post>>;
};

export function PostButtons({ currentPost, setCurrentPost }: PostButtonsProps) {
    const [askConfirmDelete, setAskConfirmDelete] = useState(false);

    const { redirectToLogin } = useContext(UserContext);

    const navigateTo = useNavigate();

    async function togglePublish(isToBePublished: boolean): Promise<void> {
        try {
            const res = await fetch(
                `${API_DOMAIN}/posts/${currentPost._id}?publish=${isToBePublished}`,
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
                        `${API_DOMAIN}/posts/${currentPost._id}?publish=${isToBePublished}`,
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
                        onClick={(): Promise<void> => togglePublish(false)}
                    >
                        Unpublish post
                    </button>
                ) : (
                    <button
                        className="transition hover:text-slate-600"
                        onClick={(): Promise<void> => togglePublish(true)}
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
    );
}
