import { ErrorList } from './ErrorList';
import { Errors } from '../pages/AccountHandler';

type LoginFormFieldsProps = {
    errors: Errors;
};

export function LoginFormFields({ errors }: LoginFormFieldsProps) {
    return (
        <>
            <h1 className="text-xl font-bold">Login</h1>

            {errors && <ErrorList errors={errors} />}

            <label className="flex flex-col ">
                Username:
                <input
                    name="username"
                    type="text"
                    className="px-2 py-1 border border-black rounded-md"
                />
            </label>

            <label className="flex flex-col">
                Password:
                <input
                    name="password"
                    type="password"
                    className="px-2 py-1 border border-black rounded-md"
                />
            </label>

            <button className="px-4 py-1 transition bg-white border border-black rounded-md hover:scale-110">
                Login
            </button>
        </>
    );
}
