import { ErrorList } from './ErrorList';
import { Errors } from '../pages/AccountHandler';

type SignupFormProps = {
    errors: Errors;
};

export function SignupFormFields({ errors }: SignupFormProps) {
    return (
        <>
            <h1 className="text-xl font-bold">Sign up</h1>
            <p>All fields are required</p>

            {errors && <ErrorList errors={errors} />}

            <label className="flex flex-col ">
                Name (required):
                <input
                    name="name"
                    type="text"
                    className="px-2 py-1 border border-black rounded-md"
                    required
                />
            </label>
            <label className="flex flex-col ">
                Username (required):
                <input
                    name="username"
                    type="text"
                    className="px-2 py-1 border border-black rounded-md"
                    required
                />
            </label>

            <ul className="w-10/12 text-center">
                <li>Password must contain at least 8 characters</li>
                <li>Password must contain at least 1 uppercase</li>
                <li>Password must contain at least 1 lowercase</li>
                <li>Password must contain at least 1 number</li>
            </ul>
            <label className="flex flex-col">
                Password (required):
                <input
                    type="password"
                    name="password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                    className="px-2 py-1 border border-black rounded-md"
                    required
                />
            </label>
            <label className="flex flex-col">
                Confirm password (required):
                <input
                    type="password"
                    className="px-2 py-1 border border-black rounded-md"
                    required
                />
            </label>

            <label className="flex flex-col">
                Enter authorisation password below:
                <input
                    name="authorPassword"
                    type="password"
                    className="px-2 py-1 border border-black rounded-md"
                    required
                />
            </label>

            <button className="px-4 py-1 transition bg-white border border-black rounded-md hover:scale-110">
                Sign up
            </button>
        </>
    );
}
