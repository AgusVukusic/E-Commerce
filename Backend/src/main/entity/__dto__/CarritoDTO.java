package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoDTO {
    private Long id;
    private Long usuarioId;
    private List<ItemCarritoDTO> items;
    private double total; // suma de subtotales
    private boolean empty;
}
