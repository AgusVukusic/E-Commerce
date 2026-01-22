package com.example.uade.tpo.ecommerce_grupo10.service.itemOrden;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemOrdenDTO;

public interface ItemOrdenService {

    ItemOrdenDTO crear(ItemOrdenDTO dto);

    ItemOrdenDTO obtenerPorId(Long id);

    Page<ItemOrdenDTO> listar(Pageable pageable);

    Page<ItemOrdenDTO> listarPorOrden(Long ordenId, Pageable pageable);

    ItemOrdenDTO actualizar(Long id, ItemOrdenDTO cambiosParciales);

    void eliminar(Long id);
}
