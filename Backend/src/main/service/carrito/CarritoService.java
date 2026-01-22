package com.example.uade.tpo.ecommerce_grupo10.service.carrito;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.CarritoDTO;

public interface CarritoService {
    CarritoDTO obtenerPorUsuario(Long usuarioId);
    CarritoDTO crearSiNoExiste(Long usuarioId);
    CarritoDTO agregarItem(Long usuarioId, Long productoId, int cantidad);
    CarritoDTO actualizarCantidad(Long usuarioId, Long productoId, int cantidad);
    CarritoDTO eliminarItem(Long usuarioId, Long productoId);
    CarritoDTO vaciar(Long usuarioId);
}
