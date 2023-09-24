import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../App';
import { ErrorList } from '../components/ErrorList';
import { Errors } from './AccountHandler';
import { getFetchOptions, HTTPVerb } from '../helpers/form_options';
import { useLocation, useNavigate } from 'react-router-dom';
import he from 'he';
import { API_DOMAIN } from '../helpers/domain';

const categories = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Other'] as const;

export function PostForm() {
    const [errors, setErrors] = useState<Errors>(null);
    const { username, redirectToLogin } = useContext(UserContext);

    const { postToEdit } = useLocation().state;

    const formRef = useRef<HTMLFormElement>(null);

    const navigateTo = useNavigate();

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    async function submitPost(e: FormEvent): Promise<void> {
        e.preventDefault();

        const request = {
            method: (postToEdit ? 'PUT' : 'POST') as HTTPVerb,
            endpoint: postToEdit ? `posts/${postToEdit._id}` : '/posts',
        };

        const formData = new FormData(formRef.current!);

        try {
            const res = await fetch(
                `${API_DOMAIN}/${request.endpoint}`,
                getFetchOptions(request.method, formData)
            );

            if (res.ok) {
                const post = await res.json();
                navigateTo(`/posts/${post._id}`, { replace: true, state: { post: post } });
            } else {
                const refreshRes = await fetch(
                    `${API_DOMAIN}/auth/refresh`,
                    getFetchOptions('GET')
                );

                if (refreshRes.ok) {
                    const retryRes = await fetch(
                        `${API_DOMAIN}/${request.endpoint}`,
                        getFetchOptions(request.method, formData)
                    );

                    if (retryRes.ok) {
                        const post = await retryRes.json();
                        navigateTo(`/posts/${post._id}`, { replace: true, state: { post: post } });
                    } else {
                        setErrors(await retryRes.json());
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
        <form
            onSubmit={submitPost}
            className="flex flex-col gap-4 p-6 mt-10 bg-white border-2 w-form border-slate-50 rounded-3xl drop-shadow-2xl"
            ref={formRef}
        >
            <div className="text-center">
                <h1 className="text-xl font-bold">
                    {postToEdit ? `Editing "${postToEdit.title}"` : 'New post'}
                </h1>
                <p>All fields are required</p>
            </div>

            {errors && <ErrorList errors={errors} />}

            <label className="flex flex-col">
                Title (required):
                <input
                    name="title"
                    type="text"
                    className="px-2 py-1 border border-black rounded-md"
                    defaultValue={postToEdit && postToEdit.title}
                    required
                />
            </label>

            <label className="flex flex-col">
                Category (required):
                <select
                    name="category"
                    defaultValue={postToEdit && postToEdit.category}
                    className="p-1 border border-black rounded-md"
                >
                    {categories.map(
                        (category, i): JSX.Element => (
                            <option key={i} value={category}>
                                {category}
                            </option>
                        )
                    )}
                </select>
            </label>

            <label className="flex flex-col">
                Text (required):
                <textarea
                    name="text"
                    rows={20}
                    className="px-2 py-1 leading-6 border border-black rounded-md"
                    defaultValue={postToEdit && he.decode(postToEdit.text)}
                    required
                ></textarea>
            </label>

            <label className="flex self-end gap-2">
                Publish?
                <input
                    name="publish"
                    type="checkbox"
                    className="px-2 py-1 border border-black rounded-md"
                    defaultChecked={postToEdit && postToEdit.isPublished}
                />
            </label>

            <button className="self-center px-4 py-1 mt-2 transition bg-white border border-black rounded-md hover:scale-110">
                {postToEdit ? 'Edit post' : 'Submit post'}
            </button>
        </form>
    );
}
