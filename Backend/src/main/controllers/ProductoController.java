package com.example.uade.tpo.ecommerce_grupo10.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperProducto;
import com.example.uade.tpo.ecommerce_grupo10.service.producto.ProductoService;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final MapperProducto mapperProducto;
    private final UsuarioService usuarioService;

    // Catálogo disponible - ADMIN ve todos, VENDEDOR ve solo los suyos
    @GetMapping
    public List<ProductoDTO> listarProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        Page<Producto> result;

        if (esAdmin) {
            // ADMIN puede ver todos los productos
            result = productoService.listarDisponibles(PageRequest.of(page, size));
        } else {
            // VENDEDOR solo puede ver sus productos
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
            if (usuarioOpt.isPresent()) {
                Long vendedorId = usuarioOpt.get().getId();
                result = productoService.listarPorVendedor(vendedorId, PageRequest.of(page, size));
            } else {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        return result.getContent().stream()
                .map(mapperProducto::toDTOConDescuentos)
                .toList();
    }

    // Buscar por titulo - ADMIN ve todos, VENDEDOR ve solo los suyos
    @GetMapping("/buscar")
    public List<ProductoDTO> buscarPorTitulo(
            @RequestParam String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        Page<Producto> result;

        if (esAdmin) {
            // ADMIN puede buscar en todos los productos
            result = productoService.buscarPorTitulo(titulo, PageRequest.of(page, size));
        } else {
            // VENDEDOR solo puede buscar en sus productos
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
            if (usuarioOpt.isPresent()) {
                Long vendedorId = usuarioOpt.get().getId();
                result = productoService.buscarPorTituloPorVendedor(vendedorId, titulo, PageRequest.of(page, size));
            } else {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        return result.getContent().stream()
                .map(mapperProducto::toDTOConDescuentos)
                .toList();
    }

    // Obtener un producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerProducto(@PathVariable Long id) {
        Producto p = productoService.get(id);
        return ResponseEntity.ok(mapperProducto.toDTOConDescuentos(p));
    } // Filtrar por categoria - ADMIN ve todos, VENDEDOR ve solo los suyos

    @GetMapping("/categoria/{id}")
    public List<ProductoDTO> porCategoria(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        Page<Producto> result;

        if (esAdmin) {
            // ADMIN puede filtrar todos los productos por categoría
            result = productoService.buscarPorCategoria(id, PageRequest.of(page, size));
        } else {
            // VENDEDOR solo puede filtrar sus productos por categoría
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
            if (usuarioOpt.isPresent()) {
                Long vendedorId = usuarioOpt.get().getId();
                result = productoService.buscarPorCategoriaPorVendedor(vendedorId, id, PageRequest.of(page, size));
            } else {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        return result.getContent().stream()
                .map(mapperProducto::toDTOConDescuentos)
                .toList();
    }

    // Crear
    @PostMapping
    public ResponseEntity<ProductoDTO> crearProducto(@RequestBody ProductoDTO dto) {
        var creado = productoService.save(dto);
        return ResponseEntity.ok(mapperProducto.toDTOConDescuentos(creado));
    }

    /// Actualizar - Solo VENDEDORES pueden editar sus propios productos, ADMIN
    /// puede editar cualquiera
    @PatchMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizarProducto(@PathVariable Long id, @RequestBody ProductoDTO dto) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        if (!esAdmin) {
            // Si no es ADMIN, verificar que sea VENDEDOR y que el producto le pertenezca
            boolean esVendedor = auth.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_VENDEDOR"));

            if (!esVendedor) {
                return ResponseEntity.status(403).build(); // Forbidden
            }

            // Obtener el producto y verificar que pertenezca al vendedor
            Producto producto = productoService.get(id);
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);

            if (usuarioOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }

            Long vendedorId = usuarioOpt.get().getId();

            // Verificar que el producto pertenezca al vendedor autenticado
            if (!producto.getVendedor().getId().equals(vendedorId)) {
                return ResponseEntity.status(403).build(); // Forbidden - no es tu producto
            }
        }

        // Si es ADMIN o es VENDEDOR y el producto le pertenece, proceder con la
        // actualización
        var actualizado = productoService.update(id, dto);
        return ResponseEntity.ok(mapperProducto.toDTOConDescuentos(actualizado));
    }

    // Eliminar - Solo VENDEDORES pueden eliminar sus propios productos, ADMIN puede
    // eliminar cualquiera
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        if (!esAdmin) {
            // Si no es ADMIN, verificar que sea VENDEDOR y que el producto le pertenezca
            boolean esVendedor = auth.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_VENDEDOR"));

            if (!esVendedor) {
                return ResponseEntity.status(403).build(); // Forbidden
            }

            // Obtener el producto y verificar que pertenezca al vendedor
            Producto producto = productoService.get(id);
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);

            if (usuarioOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }

            Long vendedorId = usuarioOpt.get().getId();

            // Verificar que el producto pertenezca al vendedor autenticado
            if (!producto.getVendedor().getId().equals(vendedorId)) {
                return ResponseEntity.status(403).build(); // Forbidden - no es tu producto
            }
        }

        // Si es ADMIN o es VENDEDOR y el producto le pertenece, proceder con la
        // eliminación
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar por precio - ADMIN ve todos, VENDEDOR ve solo los suyos
    @GetMapping("/precio")
    public ResponseEntity<Page<ProductoDTO>> buscarPorPrecio(
            @RequestParam Double min,
            @RequestParam Double max,
            @PageableDefault(size = 10, sort = "precio") Pageable pageable) {

        // Obtener el usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();

        // Verificar si el usuario es ADMIN
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        Page<ProductoDTO> result;

        if (esAdmin) {
            // ADMIN puede buscar todos los productos por precio
            result = productoService.buscarPorPrecio(min, max, pageable);
        } else {
            // VENDEDOR solo puede buscar sus productos por precio
            Optional<UsuarioDTO> usuarioOpt = usuarioService.buscarPorEmail(emailUsuario);
            if (usuarioOpt.isPresent()) {
                Long vendedorId = usuarioOpt.get().getId();
                result = productoService.buscarPorPrecioPorVendedor(vendedorId, min, max, pageable);
            } else {
                throw new RuntimeException("Usuario no encontrado");
            }
        }

        return ResponseEntity.ok(result);
    }
}
