import { Post } from '../pages/Posts';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
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
    const [existingFeatures, setExistingFeatures] = useState<Post[] | null>(null);

    const { redirectToLogin } = useContext(UserContext);

    const navigateTo = useNavigate();

    // in order to show a list of already featured posts upon loading page (and not just show when
    // the feature button is toggled)
    useEffect((): void => {
        toggleFeaturedPublished('feature', currentPost.isFeatured);
        // disabled as adding dependency causes infinite requests - specifically on need to run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function toggleFeaturedPublished(
        action: 'feature' | 'publish',
        isToActivate: boolean
    ): Promise<void> {
        try {
            const res = await fetch(
                `${API_DOMAIN}/posts/${currentPost._id}?${action}=${isToActivate}`,
                getFetchOptions('PATCH')
            );

            if (res.ok) {
                const { editedPost, existingFeaturedPosts } = await res.json();
                setCurrentPost(editedPost);

                if (action === 'feature') {
                    setExistingFeatures(existingFeaturedPosts);
                }
            } else {
                const refreshRes = await fetch(
                    `${API_DOMAIN}/auth/refresh`,
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `${API_DOMAIN}/posts/${currentPost._id}?${action}=${isToActivate}`,
                        getFetchOptions('PATCH')
                    );
                    if (retryRes.ok) {
                        const { editedPost, existingFeaturedPosts } = await res.json();
                        setCurrentPost(editedPost);

                        if (action === 'feature') {
                            setExistingFeatures(existingFeaturedPosts);
                        }
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
            {existingFeatures && (
                <div>
                    <p className="font-bold text-center text-red-800">
                        The following posts are also marked as featured:
                    </p>
                    {existingFeatures.map(
                        (featuredPost, i): JSX.Element => (
                            <p key={i} className="text-center text-red-800">
                                {featuredPost.title}
                            </p>
                        )
                    )}
                </div>
            )}
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
                        Delete
                    </button>
                ) : null}

                <Link
                    to="edit"
                    className="transition hover:text-slate-600"
                    state={{ postToEdit: currentPost }}
                >
                    Edit
                </Link>

                {currentPost.isFeatured ? (
                    <button
                        className="transition hover:text-slate-600"
                        onClick={(): Promise<void> => toggleFeaturedPublished('feature', false)}
                    >
                        Unfeature
                    </button>
                ) : (
                    <button
                        className="transition hover:text-slate-600"
                        onClick={(): Promise<void> => toggleFeaturedPublished('feature', true)}
                    >
                        Feature
                    </button>
                )}

                {currentPost.isPublished ? (
                    <button
                        className="transition hover:text-slate-600"
                        onClick={(): Promise<void> => toggleFeaturedPublished('publish', false)}
                    >
                        Unpublish
                    </button>
                ) : (
                    <button
                        className="transition hover:text-slate-600"
                        onClick={(): Promise<void> => toggleFeaturedPublished('publish', true)}
                    >
                        Publish
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
