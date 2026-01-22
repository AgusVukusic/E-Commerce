package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioId(Long usuarioId);
}
