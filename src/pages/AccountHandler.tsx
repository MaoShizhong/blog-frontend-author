import { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../App';
import { getFetchOptions } from '../helpers/form_options';
import { SignupFormFields } from '../components/SignupFormFields';
import { LoginFormFields } from '../components/LoginFormFields';
import { API_DOMAIN } from '../helpers/domain';

type ValidationError = {
    type: string;
    msg: string;
    path: string;
    location: string;
};

export type Errors = {
    errors?: ValidationError[];
    message?: string;
} | null;

export type AccessType = 'login' | 'signup';
type AccountHandlerProps = { loginType: AccessType };

export function AccountHandler({ loginType }: AccountHandlerProps) {
    const [errors, setErrors] = useState<Errors>(null);

    const { username, redirectToPosts } = useContext(UserContext);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect((): void => {
        if (username) redirectToPosts();
    }, [username, redirectToPosts]);

    async function login(e: FormEvent, loginType: AccessType): Promise<void> {
        e.preventDefault();
        const formData = new FormData(formRef.current!);

        try {
            const res = await fetch(
                `${API_DOMAIN}/auth/${loginType}`,
                getFetchOptions('POST', formData)
            );

            if (res.ok) {
                const user = await res.json();
                redirectToPosts(user.username);
            } else {
                // Mostly form validation errors
                setErrors(await res.json());
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form
            onSubmit={(e: FormEvent): Promise<void> => login(e, loginType)}
            className="flex flex-col items-center object-contain w-8/12 gap-4 p-6 mt-10 bg-white border-2 border-slate-50 rounded-3xl drop-shadow-2xl"
            ref={formRef}
        >
            {loginType === 'login' ? (
                <LoginFormFields errors={errors} />
            ) : (
                <SignupFormFields errors={errors} />
            )}
        </form>
    );
}
