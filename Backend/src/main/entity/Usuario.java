package com.example.uade.tpo.ecommerce_grupo10.entity;

import java.util.HashSet;
import java.util.Set;

import com.example.uade.tpo.ecommerce_grupo10.entity.cart.Carrito;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity // indica que es una entidad de JPA
@Table(name = "usuarios") // Le cambiamos el nombre a la tabla a "usuarios"
@Getter // genera todos los getters
@Setter // genera todos los setters
@NoArgsConstructor // genera el constructor por defecto
@AllArgsConstructor // genera el constructor con todos los parametros
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // generacion del ID automaticamente
    private Long id;

    @Column(nullable= false, length=100, unique = true) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String username;

    @Column(nullable= false, length=100) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String password;

    @Column(nullable= false, length=100) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String nombre;
    
    @Column(nullable= false, length=100) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String apellido;

    @Column(nullable= false, length=100, unique = true) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String email;

    @Column(nullable= false, length=100) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String telefono;

    @Column(nullable= false, length=100) // columna no puede ser nula y es un VARCHAR de 100 caracteres
    private String direccion;

    @Enumerated(EnumType.STRING)
    @Column(nullable= false) // columna no puede ser nula
    private Rol rol; // rol del usuario (ADMIN, COMPRADOR, VENDEDOR)

    @OneToOne(mappedBy= "usuario") 
    private Carrito carrito; // Relacion uno a uno con la entidad Carrito, cada usuario tiene un carrito asociado

    // si el usuario es vendedor, puede tener productos asociados
    @OneToMany(mappedBy = "vendedor")
    private Set<Producto> productos = new HashSet<>(); // Set de productos asociados

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true) // relacion uno a muchos con la entidad Orden
    // cascade = CascadeType.ALL permite que cualquier operacion de usuario, se aplique a sus ordens asociadas (borrar, actualizar, etc.)
    // orphanRemoval = true permite que al eliminar una orden de un usuario,
    // se elimine la orden de la base de datos si ya no tiene un usuario asociado
    private Set<Orden> compras = new HashSet<>();
    
    // metodos de conveniencia para asegurar las relaciones bidireccionales

    public void agregarProducto(Producto producto) {
        if (producto == null)
            return;
        // evitar duplicados
        if (this.productos.add(producto)) {
            producto.setVendedor(this);
        }
    }

    public void quitarProducto(Producto producto) {
        if (producto == null)
            return;
        if (this.productos.remove(producto)) {
            // cortar la relación del otro lado solo si apuntaba a este usuario
            if (producto.getVendedor() == this) {
                producto.setVendedor(null);
            }
        }
    }

    public void agregarCompra(Orden orden) {
        if (orden == null)
            return;
        if (this.compras.add(orden)) {
            orden.setUsuario(this);
        }
    }

    public void quitarCompra(Orden orden) {
        if (orden == null)
            return;
        if (this.compras.remove(orden)) {
            if (orden.getUsuario() == this) {
                orden.setUsuario(null);
            }
        }
    }

    public void asignarCarrito(Carrito carrito) {
        // desvincular carrito actual si existiera
        if (this.carrito != null) {
            Carrito actual = this.carrito;
            this.carrito = null;
            if (actual.getUsuario() == this) {
                actual.setUsuario(null);
            }
        }
        // vincular nuevo
        if (carrito != null) {
            this.carrito = carrito;
            carrito.setUsuario(this); // lado dueño debe guardar la FK
        }
    }

    public void desasignarCarrito() {
        if (this.carrito != null) {
            Carrito actual = this.carrito;
            this.carrito = null;
            if (actual.getUsuario() == this) {
                actual.setUsuario(null);
            }
        }
    }

}
