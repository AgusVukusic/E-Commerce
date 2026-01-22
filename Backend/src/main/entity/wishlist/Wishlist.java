package com.example.uade.tpo.ecommerce_grupo10.entity.wishlist;

import java.util.HashSet;
import java.util.Set;

import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "wishlists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Wishlist {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false) // el optional indica que un usuario debe tener una wishlist
    @JoinColumn(name = "usuario_id", unique = true) // columna que referencia al usuario, debe ser unica
    private Usuario usuario;

    @OneToMany(mappedBy = "wishlist")
    private Set<WishlistItem> items = new HashSet<>();


}
