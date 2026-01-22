package com.example.uade.tpo.ecommerce_grupo10.entity.cart;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="items_carrito")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class ItemCarrito {
    
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private int cantidad;

    @Column(nullable=false)
    private double precioUnitario; 

    @ManyToOne
    private Carrito carrito; // Relacion con la entidad Carrito

    @ManyToOne
    private Producto producto; // Relacion con la entidad Producto, cada item del carrito tiene un producto asociado
}
