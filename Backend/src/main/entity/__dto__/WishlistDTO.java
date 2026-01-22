package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDTO {
    private Long id;
    private Long usuarioId;
    private int itemsTotales;
    private List<WishlistItemDTO> items;
    private boolean empty;
}
