package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemOrdenDTO;

@Component
public class MapperItemOrden {

    // ENTIDAD a DTO
    public ItemOrdenDTO toDTO(ItemOrden it) {
        if (it == null)
            return null;

        Long ordenId = (it.getOrden() != null) ? it.getOrden().getId() : null;

        double precio = it.getPrecioUnitario();
        double desc = it.getDescuentoAplicado();
        int cant = it.getCantidad();

        double precioConDescuento = Math.max(0, precio - desc);
        double subtotal = precioConDescuento * cant;

        return ItemOrdenDTO.builder()
                .id(it.getId())
                .productoId(it.getIdProducto())
                .productoTitulo(it.getTitulo())
                .cantidad(it.getCantidad())
                .precio(it.getPrecioUnitario())
                .precioConDescuento(precioConDescuento)
                .descuentoAplicado(it.getDescuentoAplicado())
                .ordenId(ordenId)
                .subtotal(subtotal)
                // Campos de compatibilidad hacia atrás
                .idProducto(it.getIdProducto())
                .titulo(it.getTitulo())
                .precioUnitario(it.getPrecioUnitario())
                .build();
    }

    // DTO a ENTIDAD
    public ItemOrden toEntity(ItemOrdenDTO dto, Orden orden) {
        if (dto == null)
            return null;

        ItemOrden it = new ItemOrden();
        it.setId(dto.getId());
        it.setIdProducto(dto.getIdProducto());
        it.setTitulo(dto.getTitulo());
        it.setCantidad(dto.getCantidad() != null ? dto.getCantidad() : 0);
        it.setPrecioUnitario(dto.getPrecioUnitario() != null ? dto.getPrecioUnitario() : 0.0);
        it.setDescuentoAplicado(dto.getDescuentoAplicado() != null ? dto.getDescuentoAplicado() : 0.0);
        it.setOrden(orden);
        return it;
    }
}
