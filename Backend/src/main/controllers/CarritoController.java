package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.uade.tpo.ecommerce_grupo10.controllers.requests.AddItemRequest;
import com.example.uade.tpo.ecommerce_grupo10.controllers.requests.UpdateCantidadRequest;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.CarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.service.carrito.CarritoService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import java.util.Optional;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/carritos")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT,
        RequestMethod.PATCH })
public class CarritoController {

    private final CarritoService carritoService;
    private final UsuarioService usuarioService;

    /**
     * Valida que el usuario autenticado sea el propietario del carrito y que sea un
     * COMPRADOR
     */
    private void validarAccesoCarrito(Long usuarioId) {
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
            throw new RuntimeException("No tienes acceso al carrito de otro usuario");
        }

        // Verificar que el usuario sea un COMPRADOR (solo los compradores tienen
        // carrito)
        if (!Rol.COMPRADOR.equals(usuario.getRol())) {
            throw new RuntimeException("Solo los compradores pueden tener carrito");
        }
    }

    @GetMapping("/debug-auth") // endpoint para debug de autenticación del carrito
    public ResponseEntity<String> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String debugInfo = "Usuario: " + (auth != null ? auth.getName() : "null") +
                ", Authorities: " + (auth != null ? auth.getAuthorities() : "null");
        System.out.println("DEBUG CARRITO: " + debugInfo);
        return ResponseEntity.ok(debugInfo);
    }

    // crear carrito si no existe y devolverlo
    @PostMapping("/usuario/{usuarioId}") // asociado a un usuario obviamente
    public ResponseEntity<CarritoDTO> crearSiNoExiste(@PathVariable Long usuarioId) {
        validarAccesoCarrito(usuarioId);
        return ResponseEntity.ok(carritoService.crearSiNoExiste(usuarioId));
    }

    // Obtener carrito del usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<CarritoDTO> obtener(@PathVariable Long usuarioId) {
        validarAccesoCarrito(usuarioId);
        CarritoDTO carrito = carritoService.obtenerPorUsuario(usuarioId);
        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            // Devuelve un objeto especial para carrito vacío
            carrito.setTotal(0);
            return ResponseEntity.ok().header("X-Empty-Carrito", "true").body(carrito);
        }
        return ResponseEntity.ok(carrito);
    }

    // Agregar item al carrito del usuario
    @PostMapping("/usuario/{usuarioId}/items")
    public ResponseEntity<CarritoDTO> agregarItem(
            @PathVariable Long usuarioId,
            @RequestBody AddItemRequest body) { // aca usamos la request que creamos
        validarAccesoCarrito(usuarioId);
        return ResponseEntity.ok(
                carritoService.agregarItem(usuarioId, body.getProductoId(), body.getCantidad()));
    }

    // Actualizar cantidad
    @PatchMapping("/usuario/{usuarioId}/items/{productoId}")
    public ResponseEntity<CarritoDTO> actualizarCantidad(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId,
            @RequestBody UpdateCantidadRequest body) { // aca usamos la otra request que creamos
        validarAccesoCarrito(usuarioId);
        return ResponseEntity.ok(
                carritoService.actualizarCantidad(usuarioId, productoId, body.getCantidad()));
    }

    // Eliminar item
    @DeleteMapping("/usuario/{usuarioId}/items/{productoId}")
    public ResponseEntity<CarritoDTO> eliminarItem(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        validarAccesoCarrito(usuarioId);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DEBUG DELETE CARRITO: Usuario: " + usuarioId + ", Producto: " + productoId +
                ", Auth: " + (auth != null ? auth.getName() : "null") +
                ", Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
        return ResponseEntity.ok(
                carritoService.eliminarItem(usuarioId, productoId));
    }

    // Vaciar carrito
    @DeleteMapping("/usuario/{usuarioId}/vaciar")
    public ResponseEntity<CarritoDTO> vaciar(@PathVariable Long usuarioId) {
        validarAccesoCarrito(usuarioId);
        return ResponseEntity.ok(carritoService.vaciar(usuarioId));
    }

}
