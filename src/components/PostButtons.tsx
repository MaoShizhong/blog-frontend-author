import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Post } from '../pages/Posts';
import { fetchData } from '../helpers/form_options';
import { UserContext } from '../App';
import he from 'he';

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
        const res = await fetchData(`/posts/${currentPost._id}?${action}=${isToActivate}`, 'PATCH');

        if (res instanceof Error) {
            navigateTo('/error');
        } else if (!res.ok) {
            redirectToLogin();
        } else {
            const { editedPost, existingFeaturedPosts } = await res.json();
            setCurrentPost(editedPost);

            if (action === 'feature') {
                setExistingFeatures(existingFeaturedPosts);
            }
        }

        // reset 'CONFIRM DELETE' button to 'Delete post' if previously clicked
        setAskConfirmDelete(false);
    }

    async function deletePost(): Promise<void> {
        const res = await fetchData(`/posts/${currentPost._id}`, 'DELETE');

        if (res instanceof Error) {
            navigateTo('/error');
        } else if (!res.ok) {
            redirectToLogin();
        } else {
            navigateTo('/posts', { replace: true });
        }
    }

    return (
        <div className="flex flex-col items-center gap-3 mb-4">
            {existingFeatures && !!existingFeatures.length && (
                <div>
                    <p className="font-bold text-center text-red-800">
                        The following posts are also marked as featured:
                    </p>
                    {existingFeatures.map(
                        (featuredPost, i): JSX.Element => (
                            <p key={i} className="text-center text-red-800">
                                {he.decode(featuredPost.title)}
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

                <button
                    className="transition hover:text-slate-600"
                    onClick={(): Promise<void> =>
                        toggleFeaturedPublished('feature', !currentPost.isFeatured)
                    }
                >
                    {currentPost.isFeatured ? 'Unfeature' : 'Feature'}
                </button>

                <button
                    className="transition hover:text-slate-600"
                    onClick={(): Promise<void> =>
                        toggleFeaturedPublished('publish', !currentPost.isPublished)
                    }
                >
                    {currentPost.isPublished ? 'Unpublish' : 'Publish'}
                </button>
            </div>

            {currentPost.isPublished && (
                <a
                    href={currentPost.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-slate-600"
                >
                    <button>
                        {'>'} Link to published post {'<'}
                    </button>
                </a>
            )}
        </div>
    );
}
