export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type FormOptions = {
    method: HTTPVerb;
    credentials: RequestCredentials;
    body?: URLSearchParams;
};

export function getFetchOptions(method: HTTPVerb, formData?: FormData): FormOptions {
    const formOptions: FormOptions = {
        method: method,
        credentials: 'include',
    };

    if (formData) {
        // Unable to resolve "missing size/sort fields from type"
        // eslint-disable-next-line
        formOptions.body = new URLSearchParams(formData as any);
    }

    return formOptions;
}
