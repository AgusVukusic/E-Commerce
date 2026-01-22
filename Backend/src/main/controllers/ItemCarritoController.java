package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemCarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.itemCarrito.ItemCarritoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/items-carrito")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT,
        RequestMethod.PATCH })
public class ItemCarritoController {

    private final ItemCarritoService itemCarritoService;

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemCarritoDTO> obtener(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemCarritoService.obtener(itemId));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long itemId) {
        itemCarritoService.eliminar(itemId);
        return ResponseEntity.noContent().build();
    }

}
