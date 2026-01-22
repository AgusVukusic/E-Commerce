package com.example.uade.tpo.ecommerce_grupo10.service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    /**
     * Obtiene el email del usuario autenticado
     */
    public String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    /**
     * Verifica si el usuario actual tiene un rol específico
     */
    public boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return false;

        return auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }

    /**
     * Verifica si el usuario es COMPRADOR
     */
    public boolean isComprador() {
        return hasRole("COMPRADOR");
    }

    /**
     * Verifica si el usuario es VENDEDOR
     */
    public boolean isVendedor() {
        return hasRole("VENDEDOR");
    }

    /**
     * Verifica si el usuario es ADMIN
     */
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    /**
     * Verifica si el usuario puede gestionar productos
     */
    public boolean canManageProducts() {
        return isVendedor() || isAdmin();
    }

    /**
     * Verifica si el usuario puede realizar compras
     */
    public boolean canPurchase() {
        return isComprador();
    }
}
