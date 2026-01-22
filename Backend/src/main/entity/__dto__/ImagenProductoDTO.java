package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImagenProductoDTO {
    private Long id;
    private String url;
    private String descripcion;
    private Boolean esPrincipal;
    private Integer ordenVisualizacion;
    private Long productoId; // solo el id del producto, no toda la entidad

    // Constructor para crear sin ID (para nuevas imágenes)
    public ImagenProductoDTO(String url, String descripcion, Boolean esPrincipal, Integer ordenVisualizacion) {
        this.url = url;
        this.descripcion = descripcion;
        this.esPrincipal = esPrincipal;
        this.ordenVisualizacion = ordenVisualizacion;
    }
}
