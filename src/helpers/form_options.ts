type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type FormOptions = {
    method: HTTPVerb;
    headers: { [key: string]: string };
    body: URLSearchParams;
};

export function getFormOptions(
    method: HTTPVerb,
    formData: FormData,
    accessToken?: string | null
): FormOptions {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const headersWithAuth = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
    };

    return {
        method: method,
        headers: accessToken ? headersWithAuth : headers,
        // Unable to resolve "missing size/sort fields from type"
        // eslint-disable-next-line
        body: new URLSearchParams(formData as any),
    };
}
