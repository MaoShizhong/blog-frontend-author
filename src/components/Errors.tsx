import { Errors } from '../pages/AccountHandler';

type ErrorsProps = {
    errors: Errors;
};

export function ErrorList({ errors }: ErrorsProps) {
    return (
        <>
            {errors?.errors && (
                <ul>
                    {errors.errors.map((error, i) => (
                        <li key={i}>{error.msg}</li>
                    ))}
                </ul>
            )}
            {errors?.message && <p>{errors.message}</p>}
        </>
    );
}
