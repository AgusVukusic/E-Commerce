package com.example.uade.tpo.ecommerce_grupo10.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistItemDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.service.wishlistItem.WishlistItemService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios/{usuarioId}/wishlist/items")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT,
        RequestMethod.PATCH })
public class WishlistItemController {

    private final WishlistItemService wishlistItemService;
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

    @GetMapping("/debug-auth") // endpoint para debug de autenticación
    public ResponseEntity<String> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String debugInfo = "Usuario: " + (auth != null ? auth.getName() : "null") +
                ", Authorities: " + (auth != null ? auth.getAuthorities() : "null");
        System.out.println("DEBUG: " + debugInfo);
        return ResponseEntity.ok(debugInfo);
    }

    @GetMapping // obtener todos los items de la wishlist
    public ResponseEntity<List<WishlistItemDTO>> list(@PathVariable Long usuarioId) {
        validarAccesoWishlist(usuarioId);
        List<WishlistItemDTO> items = wishlistItemService.listItems(usuarioId);
        if (items == null || items.isEmpty()) {
            // Devuelve un objeto especial para listas vacías
            return ResponseEntity.ok().header("X-Empty-List", "true").body(List.of());
        }
        return ResponseEntity.ok(items);
    }

    @PostMapping("/{productoId}") // agregar un item a la wishlist
    public ResponseEntity<WishlistItemDTO> add(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        validarAccesoWishlist(usuarioId);
        return ResponseEntity.ok(wishlistItemService.addItem(usuarioId, productoId));
    }

    @DeleteMapping("/{productoId}") // eliminar un item de la wishlist
    public ResponseEntity<Void> remove(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        validarAccesoWishlist(usuarioId);
        System.out.println("DEBUG: DELETE wishlist item - Usuario: " + usuarioId + ", Producto: " + productoId);
        wishlistItemService.removeItem(usuarioId, productoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productoId}/exists") // verificar si un item existe en la wishlist
    public ResponseEntity<Boolean> exists(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        validarAccesoWishlist(usuarioId);
        return ResponseEntity.ok(wishlistItemService.exists(usuarioId, productoId));
    }
}
