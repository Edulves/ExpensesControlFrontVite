import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "../services/auth";

// Escuta o evento disparado quando a API responde 401 e leva o usuário ao login com aviso.
export default function AuthExpiredListener() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onExpired = () => {
            if (location.pathname === "/login") return;
            navigate("/login", { replace: true, state: { sessionExpired: true } });
        };

        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, [navigate, location.pathname]);

    return null;
}
