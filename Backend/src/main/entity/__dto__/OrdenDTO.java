package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDTO {
    private Long id;
    private java.time.LocalDateTime fecha;
    private String estado;
    private double total;
    private Long usuarioId;
    private Set<Long> itemIds; // Para compatibilidad hacia atrás
    private List<ItemOrdenDTO> items; // Detalle completo de los items
}