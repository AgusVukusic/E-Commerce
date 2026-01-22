package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.ImagenProducto;

@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {

    // traer todas las imgs de un producto
    List<ImagenProducto> findByProductoId(Long productoId);

    // buscar una imagen en particular de un producto
    Optional<ImagenProducto> findByIdAndProductoId(Long id, Long productoId);

    // verificar si ya existe una URL asociada a un producto
    boolean existsByProductoIdAndUrl(Long productoId, String url);

    // contar imgs de un producto, para validar
    int countByProductoId(Long productoId);

    // Buscar todas las imágenes de un producto ordenadas por orden de visualización
    List<ImagenProducto> findByProductoIdOrderByOrdenVisualizacionAsc(Long productoId);

    // Buscar la imagen principal de un producto
    Optional<ImagenProducto> findByProductoIdAndEsPrincipalTrue(Long productoId);

    // Eliminar todas las imágenes de un producto
    void deleteByProductoId(Long productoId);

    // Buscar imágenes principales de múltiples productos
    @Query("SELECT i FROM ImagenProducto i WHERE i.producto.id IN :productosIds AND i.esPrincipal = true")
    List<ImagenProducto> findImagenesPrincipalesByProductosIds(@Param("productosIds") List<Long> productosIds);
}
