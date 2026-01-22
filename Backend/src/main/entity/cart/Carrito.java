package com.example.uade.tpo.ecommerce_grupo10.entity.cart;

import java.util.ArrayList;
import java.util.List;

import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="carritos")
@Getter // genera los getters
@Setter // genera los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class Carrito {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @OneToOne // relacion uno a uno con la entidad Usuario
    private Usuario usuario; // Usuario al que pertenece el carrito

    @OneToMany(mappedBy = "carrito") // relacion uno a muchos con la entidad ItemCarrito
    private List<ItemCarrito> items = new ArrayList<>(); // Lista de items en el carrito
}
