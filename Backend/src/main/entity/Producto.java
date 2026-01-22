package com.example.uade.tpo.ecommerce_grupo10.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.uade.tpo.ecommerce_grupo10.entity.cart.ItemCarrito;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productos")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 500) // las descripciones pueden ser largas
    private String descripcion;

    @Column(nullable = false)
    private double precio;

    @Column(nullable = false)
    private int stock;

    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = true) // Permitir null cuando se elimina el vendedor
    private Usuario vendedor; // Relacion muchos a uno con la entidad Usuario, cada producto tiene un vendedor
                              // asociado

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria; // Relacion muchos a uno con la entidad Categoria, cada producto pertenece a una
                                 // categoria

    // ! por ahora una sola imagen
    @Column(length = 500)
    private String imagenUrl;

    @OneToOne(mappedBy = "producto", fetch = FetchType.LAZY) // relacion uno a uno con la entidad DescuentoProducto
    private DescuentoProducto descuento; // Cada producto puede tener un descuento asociado (los descuentos no son
                                         // acumulables)

    @OneToMany(mappedBy = "producto") // relacion uno a muchos con la entidad ItemCarrito
    private Set<ItemCarrito> itemsCarrito = new HashSet<>(); // Set de items del carrito asociados a este producto

    @OneToMany(mappedBy = "producto", fetch = FetchType.LAZY) // relacion uno a muchos con las imagenes
    private List<ImagenProducto> imagenes = new ArrayList<>(); // Lista de imagenes del producto
}
