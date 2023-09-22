import jwtDecode, { JwtPayload } from 'jwt-decode';

export function hasValidAccessToken(accessToken: string): boolean {
    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    console.log(decodedToken);
    return decodedToken.exp! * 1000 >= Date.now();
}
