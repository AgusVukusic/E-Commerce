package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.descuentoProducto.DescuentoProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
public class DescuentoProductoController {

    private static final Logger logger = LoggerFactory.getLogger(DescuentoProductoController.class);

    private final DescuentoProductoService service;

    /**
     * Valida que el usuario autenticado sea el propietario del producto (VENDEDOR)
     * o sea ADMIN
     */
    private void validarPropietarioProducto(Long productoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Si es ADMIN, puede hacer todo
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (esAdmin) {
            return; // ADMIN puede gestionar descuentos de cualquier producto
        }

        // Si es VENDEDOR, verificar que sea propietario del producto
        service.validarPropietarioProducto(productoId, emailUsuario);
    }

    /**
     * Valida que el usuario autenticado sea el propietario del producto asociado al
     * descuento
     */
    private void validarPropietarioDescuento(Long descuentoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Si es ADMIN, puede hacer todo
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (esAdmin) {
            return; // ADMIN puede gestionar cualquier descuento
        }

        // Si es VENDEDOR, verificar que sea propietario del producto del descuento
        service.validarPropietarioDescuento(descuentoId, emailUsuario);
    }

    // endpoints anidados por producto

    @PostMapping("/productos/{productoId}/descuento")
    public ResponseEntity<DescuentoProductoDTO> crear(
            @PathVariable Long productoId,
            @RequestBody @Validated DescuentoProductoDTO body) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        logger.info("POST /productos/{}/descuento - Usuario: {}", productoId, emailUsuario);
        logger.debug("Body recibido: {}", body);

        try {
            // Validar que el usuario sea propietario del producto
            validarPropietarioProducto(productoId);

            body.setProductoId(productoId);
            DescuentoProductoDTO resultado = service.crear(productoId, body);

            logger.info("Descuento creado exitosamente con ID: {} para producto ID: {}", resultado.getId(), productoId);
            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            logger.error("Error al crear descuento para producto ID {}: {} - {}",
                    productoId, e.getClass().getSimpleName(), e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/productos/{productoId}/descuento")
    public ResponseEntity<DescuentoProductoDTO> obtenerPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(service.obtenerPorProducto(productoId));
    }

    @PatchMapping("/productos/{productoId}/descuento/{id}")
    public ResponseEntity<DescuentoProductoDTO> actualizar(
            @PathVariable Long productoId,
            @PathVariable Long id,
            @RequestBody @Validated DescuentoProductoDTO body) {

        // Validar que el usuario sea propietario del producto
        validarPropietarioProducto(productoId);

        body.setProductoId(productoId);
        return ResponseEntity.ok(service.actualizar(id, body));
    }

    @DeleteMapping("/productos/{productoId}/descuento/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long productoId, @PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        logger.info("DELETE /productos/{}/descuento/{} - Usuario: {}", productoId, id, emailUsuario);

        try {
            // Validar que el usuario sea propietario del producto
            validarPropietarioProducto(productoId);

            logger.debug("Validación de propietario exitosa, procediendo a eliminar descuento ID: {}", id);
            service.eliminar(id);

            logger.info("Descuento ID {} eliminado exitosamente", id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            logger.error("Error al eliminar descuento ID {}: {} - {}", id, e.getClass().getSimpleName(), e.getMessage(),
                    e);
            throw e;
        }
    }

    // endpoints por id
    @GetMapping("/descuentos/{id}")
    public ResponseEntity<DescuentoProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PatchMapping("/descuentos/{id}/activar")
    public ResponseEntity<DescuentoProductoDTO> activar(@PathVariable Long id) {
        // Validar que el usuario sea propietario del descuento
        validarPropietarioDescuento(id);

        return ResponseEntity.ok(service.activar(id));
    }

    @PatchMapping("/descuentos/{id}/desactivar")
    public ResponseEntity<DescuentoProductoDTO> desactivar(@PathVariable Long id) {
        // Validar que el usuario sea propietario del descuento
        validarPropietarioDescuento(id);

        return ResponseEntity.ok(service.desactivar(id));
    }

    @GetMapping("/descuentos")
    public ResponseEntity<Page<DescuentoProductoDTO>> listar(Pageable pageable) {
        return ResponseEntity.ok(service.listar(pageable));
    }
}
