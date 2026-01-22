package com.example.uade.tpo.ecommerce_grupo10.service.imagenProducto;

import java.util.List;
import java.util.Optional;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ImagenProductoDTO;

public interface ImagenProductoService {

    // crear con una url
    ImagenProductoDTO agregarImagen(Long productoId, String url);

    // crear imagen completa con nuevos campos
    ImagenProductoDTO crearImagen(Long productoId, ImagenProductoDTO imagenDTO);

    // actualizar solo la URL
    ImagenProductoDTO actualizarUrl(Long productoId, Long imagenId, String nuevaUrl);

    // actualizar imagen completa
    ImagenProductoDTO actualizarImagen(Long imagenId, ImagenProductoDTO imagenDTO);

    void eliminarImagen(Long productoId, Long imagenId);

    List<ImagenProductoDTO> listarPorProducto(Long productoId);

    ImagenProductoDTO obtener(Long productoId, Long imagenId);

    // Nuevos métodos para manejo de múltiples imágenes
    Optional<ImagenProductoDTO> obtenerImagenPrincipal(Long productoId);

    void establecerImagenPrincipal(Long productoId, Long imagenId);

    boolean puedeGestionarImagen(Long imagenId, Long usuarioId);
}
