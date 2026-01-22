package com.example.uade.tpo.ecommerce_grupo10.service.descuentoProducto;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;

public interface DescuentoProductoService {

    DescuentoProductoDTO crear(Long productoId, DescuentoProductoDTO dto);

    DescuentoProductoDTO obtenerPorId(Long id);

    DescuentoProductoDTO obtenerPorProducto(Long productoId);

    // Nuevo método que no lanza excepción
    Optional<DescuentoProductoDTO> obtenerPorProductoOptional(Long productoId);

    Page<DescuentoProductoDTO> listar(Pageable pageable);

    DescuentoProductoDTO actualizar(Long id, DescuentoProductoDTO dto);

    DescuentoProductoDTO activar(Long id);

    DescuentoProductoDTO desactivar(Long id);

    void eliminar(Long id);

    void validarPropietarioProducto(Long productoId, String emailUsuario);

    void validarPropietarioDescuento(Long descuentoId, String emailUsuario);
}
