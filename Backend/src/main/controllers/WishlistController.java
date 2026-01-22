package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.service.wishlist.WishlistService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import java.util.Optional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios/{usuarioId}/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UsuarioService usuarioService;

    /**
     * Valida que el usuario autenticado sea el propietario de la wishlist y que sea
     * un COMPRADOR
     */
    private void validarAccesoWishlist(Long usuarioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Obtener el usuario por email para verificar que coincida con el usuarioId
        Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        UsuarioDTO usuario = usuarioOpt.get();

        // Verificar que el usuario autenticado sea el mismo que el usuarioId del path
        if (!usuario.getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes acceso a la wishlist de otro usuario");
        }

        // Verificar que el usuario sea un COMPRADOR (solo los compradores tienen
        // wishlist)
        if (!Rol.COMPRADOR.equals(usuario.getRol())) {
            throw new RuntimeException("Solo los compradores pueden tener wishlist");
        }
    }

    // Obtener o crear la wishlist del usuario
    @PostMapping("/create-if-not-exists")
    public ResponseEntity<WishlistDTO> createIfNotExists(@PathVariable Long usuarioId) {
        validarAccesoWishlist(usuarioId);
        return ResponseEntity.ok(wishlistService.getOrCreateByUsuario(usuarioId));
    }

    // Obtener la wishlist
    @GetMapping
    public ResponseEntity<WishlistDTO> get(@PathVariable Long usuarioId) {
        validarAccesoWishlist(usuarioId);
        WishlistDTO wishlist = wishlistService.getByUsuario(usuarioId);
        if (wishlist.getItems() == null || wishlist.getItems().isEmpty()) {
            // Devuelve un objeto especial para wishlist vacía
            wishlist.setItemsTotales(0);
            return ResponseEntity.ok().header("X-Empty-Wishlist", "true").body(wishlist);
        }
        return ResponseEntity.ok(wishlist);
    }

    // Vaciar la wishlist
    @DeleteMapping("/items")
    public ResponseEntity<Void> clear(@PathVariable Long usuarioId) {
        validarAccesoWishlist(usuarioId);
        wishlistService.clearByUsuario(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
