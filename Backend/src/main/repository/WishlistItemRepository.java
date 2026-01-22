package com.example.uade.tpo.ecommerce_grupo10.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.WishlistItem;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    
    List<WishlistItem> findAllByWishlistId(Long wishlistId);
    Optional<WishlistItem> findByWishlistIdAndProductoId(Long wishlistId, Long productoId);
    boolean existsByWishlistIdAndProductoId(Long wishlistId, Long productoId);
    long countByWishlistId(Long wishlistId);
    void deleteByWishlistIdAndProductoId(Long wishlistId, Long productoId);

}
