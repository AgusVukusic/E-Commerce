package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.ImagenProducto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ImagenProductoDTO;

@Component
public class MapperImagenProducto {

    public ImagenProductoDTO toDTO(ImagenProducto img) {
        if (img == null)
            return null;
        return ImagenProductoDTO.builder()
                .id(img.getId())
                .url(img.getUrl())
                .descripcion(img.getDescripcion())
                .esPrincipal(img.getEsPrincipal())
                .ordenVisualizacion(img.getOrdenVisualizacion())
                .productoId(img.getProducto() != null ? img.getProducto().getId() : null)
                .build();
    }

    public ImagenProducto toEntity(ImagenProductoDTO dto) {
        if (dto == null)
            return null;
        ImagenProducto img = new ImagenProducto();
        img.setId(dto.getId());
        img.setUrl(dto.getUrl());
        img.setDescripcion(dto.getDescripcion());
        img.setEsPrincipal(dto.getEsPrincipal() != null ? dto.getEsPrincipal() : false);
        img.setOrdenVisualizacion(dto.getOrdenVisualizacion() != null ? dto.getOrdenVisualizacion() : 0);
        return img;
    }
}
