package com.example.uade.tpo.ecommerce_grupo10.entity.wishlist;

import java.time.LocalDateTime;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "wishlist_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WishlistItem {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // lazy indica que la carga de la wishlist se realiza bajo demanda
    @JoinColumn(name = "wishlist_id")
    private Wishlist wishlist;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(nullable = false)
    private LocalDateTime agregadoA = LocalDateTime.now();

}
