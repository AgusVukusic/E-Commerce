package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.DescuentoProducto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;

@Component
public class MapperDescuentoProducto {
    
    public DescuentoProductoDTO toDTO(DescuentoProducto d) {
        if (d == null) return null;
        return DescuentoProductoDTO.builder()
                .id(d.getId())
                .porcentajeDescuento(d.getPorcentajeDescuento())
                .fechaInicio(d.getFechaInicio())
                .fechaFin(d.getFechaFin())
                .activo(d.isActivo())
                .productoId(d.getProducto() != null ? d.getProducto().getId() : null)
                .build();
    }

    public DescuentoProducto toEntity(DescuentoProductoDTO dto, Producto producto) {
        if (dto == null) return null;
        DescuentoProducto d = new DescuentoProducto();
        d.setId(dto.getId());
        d.setPorcentajeDescuento(dto.getPorcentajeDescuento());
        d.setFechaInicio(dto.getFechaInicio());
        d.setFechaFin(dto.getFechaFin());
        d.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        d.setProducto(producto);
        return d;
    }

    // este metodo actualiza una entidad existente con los valores de un DTO
    public void updateEntityFromDTO(DescuentoProductoDTO dto, DescuentoProducto entity, Producto producto) {
        if (dto == null || entity == null) return;
        if (dto.getPorcentajeDescuento() != null) entity.setPorcentajeDescuento(dto.getPorcentajeDescuento());
        if (dto.getFechaInicio() != null) entity.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null) entity.setFechaFin(dto.getFechaFin());
        if (dto.getActivo() != null) entity.setActivo(dto.getActivo());
        if (producto != null) entity.setProducto(producto);
    }
}
