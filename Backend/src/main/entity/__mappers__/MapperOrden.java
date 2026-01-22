package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MapperOrden {

    private final MapperItemOrden mapperItemOrden;

    public OrdenDTO toDTO(Orden o) {
        if (o == null)
            return null;

        Set<Long> itemIds = (o.getItems() == null)
                ? Collections.emptySet()
                : o.getItems().stream()
                        .map(ItemOrden::getId)
                        .collect(Collectors.toSet());

        List<com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemOrdenDTO> itemsDTO = (o.getItems() == null)
                ? Collections.emptyList()
                : o.getItems().stream()
                        .map(mapperItemOrden::toDTO)
                        .collect(Collectors.toList());

        Long usuarioId = (o.getUsuario() != null) ? o.getUsuario().getId() : null;

        return OrdenDTO.builder()
                .id(o.getId())
                .fecha(o.getFechaCreacion())
                .estado(o.getEstado())
                .total(o.getTotal())
                .usuarioId(usuarioId)
                .itemIds(itemIds)
                .items(itemsDTO)
                .build();
    }

    public Orden toEntity(OrdenDTO dto, Usuario usuario, Set<ItemOrden> items) {
        if (dto == null)
            return null;

        Orden o = new Orden();
        o.setId(dto.getId());
        o.setFechaCreacion(dto.getFecha());
        o.setEstado(dto.getEstado());
        o.setTotal(dto.getTotal());
        o.setUsuario(usuario);
        o.setItems(items != null ? items : Collections.emptySet());
        return o;
    }
}
