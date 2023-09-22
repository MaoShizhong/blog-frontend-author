export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Headers = { [key: string]: string };

type FormOptions = {
    method: HTTPVerb;
    headers: Headers;
    body?: URLSearchParams;
};

type FetchOptions = {
    method: HTTPVerb;
    formData?: FormData;
    accessToken?: string | null;
};

export function getFormOptions(options: FetchOptions): FormOptions {
    const formOptions: FormOptions = {
        method: options.method,
        headers: getHeaders(options.accessToken),
    };

    if (options.formData) {
        // Unable to resolve "missing size/sort fields from type"
        // eslint-disable-next-line
        formOptions.body = new URLSearchParams(options.formData as any);
    }

    return formOptions;
}

function getHeaders(accessToken?: string | null): Headers {
    const headers: Headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        credentials: 'include',
    };

    if (accessToken) {
        headers['Authorization'] = accessToken;
    }

    return headers;
}
