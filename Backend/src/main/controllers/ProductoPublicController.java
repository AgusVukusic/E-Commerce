package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperProducto;
import com.example.uade.tpo.ecommerce_grupo10.service.producto.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/productos-publicos")
public class ProductoPublicController {

    private final ProductoService productoService;
    private final MapperProducto mapperProducto;

    /**
     * Endpoints publicos para que los COMPRADORES puedan ver productos
     * Sin autenticacion requerida
     */

    @GetMapping
    public ResponseEntity<Page<ProductoDTO>> listarProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.listarDisponibles(pageable)
                .map(mapperProducto::toDTOConDescuentos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(mapperProducto.toDTOConDescuentos(productoService.get(id)));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<Page<ProductoDTO>> productosPorCategoria(
            @PathVariable Long categoriaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.buscarPorCategoria(categoriaId, pageable)
                .map(mapperProducto::toDTOConDescuentos));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<ProductoDTO>> buscarProductos(
            @RequestParam String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.buscarPorTitulo(titulo, pageable)
                .map(mapperProducto::toDTOConDescuentos));
    }

    @GetMapping("/precio")
    public ResponseEntity<Page<ProductoDTO>> buscarPorPrecio(
            @RequestParam Double precioMin,
            @RequestParam Double precioMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productoService.buscarPorPrecio(precioMin, precioMax, pageable));
    }
}
