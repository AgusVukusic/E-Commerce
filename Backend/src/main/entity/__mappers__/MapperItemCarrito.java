package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemCarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.cart.ItemCarrito;

@Component
public class MapperItemCarrito {

    public ItemCarritoDTO toDTO(ItemCarrito it) {
        if (it == null)
            return null;
        Producto p = it.getProducto();
        double subtotal = it.getCantidad() * it.getPrecioUnitario();
        return ItemCarritoDTO.builder()
                .id(it.getId())
                .productoId(p != null ? p.getId() : null)
                .productoTitulo(p != null ? p.getTitulo() : null)
                .cantidad(it.getCantidad())
                .precioUnitario(it.getPrecioUnitario())
                .subtotal(subtotal)
                .build();
    }
}
