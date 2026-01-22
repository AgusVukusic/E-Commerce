package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCarritoDTO {
    private Long id;
    private Long productoId;
    private String productoTitulo;
    private int cantidad;
    private double precioUnitario;
    private double subtotal; // cantidad * precioUnitario
}
