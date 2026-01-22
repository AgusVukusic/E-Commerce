package com.example.uade.tpo.ecommerce_grupo10.service.wishlist;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistDTO;

public interface WishlistService {
    WishlistDTO getOrCreateByUsuario(Long usuarioId);
    WishlistDTO getByUsuario(Long usuarioId);
    void clearByUsuario(Long usuarioId);
}
