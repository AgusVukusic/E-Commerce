package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DescuentoProductoDTO {
    private Long id;
    private Double porcentajeDescuento; // 0..100
    private Date fechaInicio;
    private Date fechaFin;
    private Boolean activo;
    private Long productoId; // referenciamos al producto
}
