import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../App';
import { ErrorList } from '../components/ErrorList';
import { Errors } from './AccountHandler';
import { getFormOptions, HTTPVerb } from '../helpers/form_options';
import { hasValidAccessToken } from '../helpers/token_validation';
import { useLocation } from 'react-router-dom';
import sanitizeHTML from 'sanitize-html';

const categories = ['JavaScript/TypeScript', 'HTML', 'CSS', 'Other'] as const;

export function PostForm() {
    const [errors, setErrors] = useState<Errors>(null);
    const [submitted, setSubmitted] = useState(false);
    const [newPostURL, setNewPostURL] = useState('');

    const { username, accessToken, redirectToLogin, refreshAccessToken } = useContext(UserContext);

    const formRef = useRef<HTMLFormElement>(null);

    const { postToEdit } = useLocation().state;

    useEffect((): void => {
        if (!username) redirectToLogin();
    }, [username, redirectToLogin]);

    async function submitPost(e: FormEvent): Promise<void> {
        e.preventDefault();

        const request = {
            method: (postToEdit ? 'PUT' : 'POST') as HTTPVerb,
            endpoint: postToEdit ? `/posts/${postToEdit._id}` : '/posts',
        };

        const formData = new FormData(formRef.current!);

        try {
            const res = await fetch(
                `http://localhost:5000${request.endpoint}`,
                getFormOptions({
                    method: request.method,
                    formData: formData,
                    accessToken: accessToken,
                })
            );

            if (res.ok) {
                const { url } = await res.json();

                setSubmitted(true);
                setNewPostURL(url);
            } else {
                // Mostly form validation errors
                setErrors(await res.json());
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {submitted ? (
                <a href={newPostURL} target="_blank" rel="noreferrer" className="my-10">
                    Link to new post (opens in new tab)
                </a>
            ) : (
                <form
                    onSubmit={submitPost}
                    className="flex flex-col gap-4 my-10 w-form"
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
                        <select name="category" className="p-1 border border-black rounded-md">
                            {categories.map(
                                (category, i): JSX.Element => (
                                    <option
                                        key={i}
                                        value={category.toLowerCase()}
                                        selected={
                                            postToEdit &&
                                            postToEdit.category === category.toLowerCase()
                                        }
                                    >
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
                            rows={14}
                            className="px-2 py-1 border border-black rounded-md"
                            required
                        >
                            {sanitizeHTML(postToEdit && postToEdit.text.join('\n'))}
                        </textarea>
                    </label>

                    <label className="flex self-end gap-2">
                        Publish?
                        <input
                            name="publish"
                            type="checkbox"
                            className="px-2 py-1 border border-black rounded-md"
                            checked={postToEdit && postToEdit.isPublished}
                        />
                    </label>

                    <button className="self-center px-4 py-1 transition bg-white border border-black rounded-md hover:scale-110">
                        {postToEdit ? 'Edit post' : 'Submit post'}
                    </button>
                </form>
            )}
        </>
    );
}
