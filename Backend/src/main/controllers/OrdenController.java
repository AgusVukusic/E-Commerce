package com.example.uade.tpo.ecommerce_grupo10.controllers;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.orden.OrdenService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import org.springframework.web.bind.annotation.*;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ordenes")
public class OrdenController {

    private final OrdenService ordenService;
    private final UsuarioService usuarioService;

    // Crear una orden
    @PostMapping
    public ResponseEntity<OrdenDTO> crear(@RequestBody OrdenDTO body) {
        return ResponseEntity.ok(ordenService.crear(body));
    }

    // Obtener orden por id
    @GetMapping("/{id}")
    public ResponseEntity<OrdenDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerPorId(id));
    }

    // Listar todas (paginado)
    @GetMapping
    public ResponseEntity<Page<OrdenDTO>> listar(Pageable pageable) {
        return ResponseEntity.ok(ordenService.listar(pageable));
    }

    // Listar por usuario (paginado)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<OrdenDTO>> listarPorUsuario(
            @PathVariable Long usuarioId,
            Pageable pageable) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        // Si no es ADMIN, verificar que el usuarioId corresponda al usuario autenticado
        if (!esAdmin) {
            // Obtener el usuario por email para comparar IDs
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
            if (usuarioOpt.isPresent()) {
                UsuarioDTO usuarioAutenticado = usuarioOpt.get();
                if (!usuarioAutenticado.getId().equals(usuarioId)) {
                    throw new RuntimeException("No tienes permisos para ver las órdenes de otro usuario");
                }
            } else {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        return ResponseEntity.ok(ordenService.listarPorUsuario(usuarioId, pageable));
    }

    // Actualizar estado
    @PatchMapping("/{id}/estado") // usamos patch para actualizar solo lo que le pasamos y que lo demas no quede
                                  // en null
    public ResponseEntity<OrdenDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestBody EstadoRequest body) {
        return ResponseEntity.ok(ordenService.actualizarEstado(id, body.getEstado()));
    }

    // Eliminar orden
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ordenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // DTO request interno para actualizar estado
    @Data
    public static class EstadoRequest {
        private String estado; // PENDIENTE | COMPLETADA
    }
}
