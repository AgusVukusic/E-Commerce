package com.example.uade.tpo.ecommerce_grupo10.service.orden;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;

public interface OrdenService {

    OrdenDTO crear(OrdenDTO dto);
    OrdenDTO obtenerPorId(Long id);
    Page<OrdenDTO> listar(Pageable pageable);
    Page<OrdenDTO> listarPorUsuario(Long usuarioId, Pageable pageable);
    OrdenDTO actualizarEstado(Long id, String nuevoEstado);
    void eliminar(Long id);
    
}
