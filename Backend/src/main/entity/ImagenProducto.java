package com.example.uade.tpo.ecommerce_grupo10.entity;

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
@Table(name = "imagenes_productos")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class ImagenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String url; // URL de la imagen del producto

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "es_principal")
    private Boolean esPrincipal = false;

    @Column(name = "orden_visualizacion")
    private Integer ordenVisualizacion = 0;

    @ManyToOne
    private Producto producto; // Relacion con la entidad Producto
}
