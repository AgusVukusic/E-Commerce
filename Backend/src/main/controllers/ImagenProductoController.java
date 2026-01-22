package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ImagenProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.imagenProducto.ImagenProductoService;
import com.example.uade.tpo.ecommerce_grupo10.service.producto.ProductoService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/productos/{productoId}/imagenes")
public class ImagenProductoController {

    private final ImagenProductoService imagenProductoService;
    private final ProductoService productoService;
    private final UsuarioService usuarioService;

    // crear imagen simple (solo URL)
    @PostMapping("/simple")
    public ResponseEntity<ImagenProductoDTO> crearSimple(
            @PathVariable Long productoId,
            @RequestBody UrlRequest body) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        ImagenProductoDTO dto = imagenProductoService.agregarImagen(productoId, body.getUrl());
        return ResponseEntity.ok(dto);
    }

    // crear imagen completa (con todos los campos)
    @PostMapping
    public ResponseEntity<ImagenProductoDTO> crear(
            @PathVariable Long productoId,
            @RequestBody ImagenProductoDTO imagenDTO) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        ImagenProductoDTO dto = imagenProductoService.crearImagen(productoId, imagenDTO);
        return ResponseEntity.ok(dto);
    }

    // listar imagenes
    @GetMapping
    public ResponseEntity<List<ImagenProductoDTO>> listar(@PathVariable Long productoId) {
        return ResponseEntity.ok(imagenProductoService.listarPorProducto(productoId));
    }

    // obtener imagen principal
    @GetMapping("/principal")
    public ResponseEntity<ImagenProductoDTO> obtenerPrincipal(@PathVariable Long productoId) {
        Optional<ImagenProductoDTO> imagen = imagenProductoService.obtenerImagenPrincipal(productoId);
        return imagen.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // una imagen puntual por producto e imagen
    @GetMapping("/{imagenId}")
    public ResponseEntity<ImagenProductoDTO> obtener(
            @PathVariable Long productoId,
            @PathVariable Long imagenId) {
        return ResponseEntity.ok(imagenProductoService.obtener(productoId, imagenId));
    }

    // actualizar URL de una imagen (método simple)
    @PutMapping("/{imagenId}")
    public ResponseEntity<ImagenProductoDTO> actualizarUrl(
            @PathVariable Long productoId,
            @PathVariable Long imagenId,
            @RequestBody UrlRequest body) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        ImagenProductoDTO dto = imagenProductoService.actualizarUrl(productoId, imagenId, body.getUrl());
        return ResponseEntity.ok(dto);
    }

    // actualizar imagen completa
    @PatchMapping("/{imagenId}")
    public ResponseEntity<ImagenProductoDTO> actualizarImagen(
            @PathVariable Long productoId,
            @PathVariable Long imagenId,
            @RequestBody ImagenProductoDTO imagenDTO) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        ImagenProductoDTO dto = imagenProductoService.actualizarImagen(imagenId, imagenDTO);
        return ResponseEntity.ok(dto);
    }

    // establecer imagen como principal
    @PatchMapping("/{imagenId}/principal")
    public ResponseEntity<Void> establecerPrincipal(
            @PathVariable Long productoId,
            @PathVariable Long imagenId) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        imagenProductoService.establecerImagenPrincipal(productoId, imagenId);
        return ResponseEntity.ok().build();
    }

    // eliminar una imagen
    @DeleteMapping("/{imagenId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long productoId,
            @PathVariable Long imagenId) {

        if (!puedeGestionarProducto(productoId)) {
            return ResponseEntity.status(403).build();
        }

        imagenProductoService.eliminarImagen(productoId, imagenId);
        return ResponseEntity.noContent().build();
    }

    // Método auxiliar para validar permisos
    private boolean puedeGestionarProducto(Long productoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // ADMIN puede gestionar cualquier producto
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        if (esAdmin) {
            return true;
        }

        // VENDEDOR solo puede gestionar sus productos
        boolean esVendedor = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_VENDEDOR"));

        if (!esVendedor) {
            return false;
        }

        // Verificar que el producto pertenezca al vendedor
        String emailUsuario = auth.getName();
        Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);

        if (usuarioOpt.isEmpty()) {
            return false;
        }

        // Obtener el producto y verificar que pertenezca al vendedor autenticado
        try {
            var producto = productoService.get(productoId);
            Long vendedorId = usuarioOpt.get().getId();
            return producto.getVendedor().getId().equals(vendedorId);
        } catch (Exception e) {
            return false;
        }
    }

    // esta clase representa el cuerpo de la solicitud para crear una nueva imagen
    // sirve para devolver un JSON solo con la url de la imagen
    // del tipo {"url": "..."}
    @Data
    public static class UrlRequest {
        private String url;
    }
}
