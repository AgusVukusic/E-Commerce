package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.uade.tpo.ecommerce_grupo10.entity.cart.ItemCarrito;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByCarritoId(Long carritoId);
    Optional<ItemCarrito> findByCarritoIdAndProductoId(Long carritoId, Long productoId);
    void deleteByCarritoId(Long carritoId);
}
