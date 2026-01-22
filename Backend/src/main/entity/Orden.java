package com.example.uade.tpo.ecommerce_grupo10.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ordenes")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private String estado; // PENDIENTE, COMPLETADA, CANCELADA

    @Column(nullable = false)
    private double total;

    @ManyToOne // relacion muchos a uno con la entidad Usuario
    private Usuario usuario;

    @OneToMany(mappedBy = "orden") // relacion uno a muchos con la entidad ItemOrden
    private Set<ItemOrden> items = new HashSet<>(); // Set de items asociados a la orden
}
