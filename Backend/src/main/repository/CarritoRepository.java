package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.cart.Carrito;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioId(Long usuarioId);
}
