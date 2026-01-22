package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemOrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.itemOrden.ItemOrdenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/items-orden")
public class ItemOrdenController {
    
    private final ItemOrdenService itemOrdenService;

    // Crear item (usa ordenId)
    @PostMapping
    public ResponseEntity<ItemOrdenDTO> crear(@RequestBody ItemOrdenDTO body) {
        return ResponseEntity.ok(itemOrdenService.crear(body));
    }

    // Crear item forzando la orden por path
    @PostMapping("/orden/{ordenId}")
    public ResponseEntity<ItemOrdenDTO> crearEnOrden(
            @PathVariable Long ordenId,
            @RequestBody ItemOrdenDTO body) {
        body.setOrdenId(ordenId); // prioriza el path
        return ResponseEntity.ok(itemOrdenService.crear(body));
    }

    // Obtener item por id
    @GetMapping("/{id}")
    public ResponseEntity<ItemOrdenDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(itemOrdenService.obtenerPorId(id));
    }

    // Listar todos (paginado)
    @GetMapping
    public ResponseEntity<Page<ItemOrdenDTO>> listar(Pageable pageable) {
        return ResponseEntity.ok(itemOrdenService.listar(pageable));
    }

    // Listar por orden (paginado)
    @GetMapping("/orden/{ordenId}")
    public ResponseEntity<Page<ItemOrdenDTO>> listarPorOrden(
            @PathVariable Long ordenId,
            Pageable pageable) {
        return ResponseEntity.ok(itemOrdenService.listarPorOrden(ordenId, pageable));
    }

    // Actualizacion parcial del item
    @PatchMapping("/{id}")
    public ResponseEntity<ItemOrdenDTO> actualizar(
            @PathVariable Long id,
            @RequestBody ItemOrdenDTO cambiosParciales) {
        return ResponseEntity.ok(itemOrdenService.actualizar(id, cambiosParciales));
    }

    // Eliminar item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        itemOrdenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
