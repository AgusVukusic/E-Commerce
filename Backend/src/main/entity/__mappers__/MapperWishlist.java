package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.Wishlist;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MapperWishlist {

        private final MapperWishlistItem mapperWishlistItem;

        public WishlistDTO toDTO(Wishlist w) {
                if (w == null)
                        return null;
                int count = (w.getItems() == null) ? 0 : w.getItems().size();
                Long usuarioId = (w.getUsuario() != null) ? w.getUsuario().getId() : null;

                boolean isEmpty = w.getItems() == null || w.getItems().isEmpty();
                var items = isEmpty ? null
                                : w.getItems().stream()
                                                .map(mapperWishlistItem::toDTO)
                                                .collect(Collectors.toList());

                return WishlistDTO.builder()
                                .id(w.getId())
                                .usuarioId(usuarioId)
                                .itemsTotales(count)
                                .items(items)
                                .empty(isEmpty)
                                .build();
        }

}
