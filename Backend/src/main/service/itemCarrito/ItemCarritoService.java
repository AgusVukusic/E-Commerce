package com.example.uade.tpo.ecommerce_grupo10.service.itemCarrito;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemCarritoDTO;

public interface ItemCarritoService {
    ItemCarritoDTO obtener(Long itemId);
    void eliminar(Long itemId);
}
