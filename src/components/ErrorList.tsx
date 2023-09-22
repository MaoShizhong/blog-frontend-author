import { Errors } from '../pages/AccountHandler';

type ErrorsProps = {
    errors: Errors;
};

export function ErrorList({ errors }: ErrorsProps) {
    return (
        <>
            {errors?.errors && (
                <ul className="font-bold text-red-800">
                    {errors.errors.map((error, i) => (
                        <li key={i}>{error.msg}</li>
                    ))}
                </ul>
            )}
            {errors?.message && (
                <p className="font-bold text-center text-red-800">{errors.message}</p>
            )}
        </>
    );
}
