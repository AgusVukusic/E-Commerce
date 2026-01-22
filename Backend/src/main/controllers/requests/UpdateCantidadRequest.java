package com.example.uade.tpo.ecommerce_grupo10.controllers.requests;

import lombok.*;

// request para el controller de carrito

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCantidadRequest {
    private int cantidad;
}