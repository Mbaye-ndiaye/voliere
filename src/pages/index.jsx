import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";

function IndexRedirect() {
    const username = useAppSelector((s) => s.auth.username);
    const navigate = useNavigate();
    useEffect(() => {
        navigate(username ? "/app/dashboard" : "/login", { replace: true });
    }, [username, navigate]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-muted-foreground", children: "Chargement\u2026" }));
}

export default IndexRedirect;
