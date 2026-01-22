export function isBuyer(user) {
    if (!user) return false;
    const r = (user.rol || user.role || "").toString().toUpperCase().replace(/^ROLE_/, "");
    return r === "COMPRADOR";
}

export function getUserId(user) {
    return user?.id ?? user?.usuarioId ?? user?.userId ?? null;
}
