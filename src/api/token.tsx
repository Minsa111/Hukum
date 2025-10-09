export function isTokenExpired(): boolean {
    const expiration = localStorage.getItem("tokenExpiration");
    if (!expiration) return true;

    const now = new Date();
    return now > new Date(expiration);
}
