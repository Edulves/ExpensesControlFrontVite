import { deleteCookie, getCookie } from "../utils/cookies";

export const AUTH_EXPIRED_EVENT = "auth:expired";

export class UnauthorizedError extends Error {
    constructor() {
        super("Sua sessão expirou. Faça login novamente.");
        this.name = "UnauthorizedError";
    }
}

export function clearAuthCookies(): void {
    deleteCookie("authToken");
    deleteCookie("tokenExpiration");
}

// Considera o token inválido se não existir ou se a data de expiração já passou.
export function isTokenValid(): boolean {
    const token = getCookie("authToken");
    if (!token) return false;

    const expiration = getCookie("tokenExpiration");
    if (expiration) {
        const expiresAt = new Date(expiration).getTime();
        if (!Number.isNaN(expiresAt) && expiresAt <= Date.now()) return false;
    }

    return true;
}

// Limpa a sessão e avisa a aplicação (AuthExpiredListener) para redirecionar ao login.
export function handleUnauthorized(): void {
    clearAuthCookies();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

// Wrapper de fetch para chamadas autenticadas: em caso de 401 encerra a sessão.
export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, init);

    if (response.status === 401) {
        handleUnauthorized();
        throw new UnauthorizedError();
    }

    return response;
}
