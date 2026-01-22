package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.DescuentoProducto;

@Repository
public interface DescuentoProductoRepository extends JpaRepository<DescuentoProducto, Long> {

    // Query explícita para asegurar que siempre consulte la BD
    @Query("SELECT d FROM DescuentoProducto d WHERE d.producto.id = :productoId")
    Optional<DescuentoProducto> findByProductoId(@Param("productoId") Long productoId);

    boolean existsByProductoId(Long productoId);

}
