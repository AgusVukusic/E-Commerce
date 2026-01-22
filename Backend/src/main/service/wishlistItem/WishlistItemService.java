package com.example.uade.tpo.ecommerce_grupo10.service.wishlistItem;

import java.util.List;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistItemDTO;

public interface WishlistItemService {
    List<WishlistItemDTO> listItems(Long usuarioId);
    WishlistItemDTO addItem(Long usuarioId, Long productoId);
    void removeItem(Long usuarioId, Long productoId);
    boolean exists(Long usuarioId, Long productoId);
}
