package com.example.uade.tpo.ecommerce_grupo10.service.carrito;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.CarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperCarrito;
import com.example.uade.tpo.ecommerce_grupo10.entity.cart.Carrito;
import com.example.uade.tpo.ecommerce_grupo10.entity.cart.ItemCarrito;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.CarritoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.ItemCarritoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.ProductoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final MapperCarrito mapperCarrito;

    @Override
    @Transactional(readOnly = true)
    public CarritoDTO obtenerPorUsuario(Long usuarioId) {
        Carrito c = carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearYGuardarCarrito(usuarioId));
        return mapperCarrito.toDTO(c);
    }

    @Override
    public CarritoDTO crearSiNoExiste(Long usuarioId) {
        Carrito c = carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearYGuardarCarrito(usuarioId));
        return mapperCarrito.toDTO(c);
    }

    @Override
    public CarritoDTO agregarItem(Long usuarioId, Long productoId, int cantidad) {
        if (cantidad <= 0)
            throw new IllegalArgumentException("La cantidad debe ser > 0");

        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearYGuardarCarrito(usuarioId));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado"));

        // 🛡️ VALIDACIÓN DE STOCK
        if (producto.getStock() <= 0) {
            throw new IllegalArgumentException("El producto no tiene stock disponible");
        }

        // Si ya existe el item, verificar que no exceda el stock
        var itemExistente = itemCarritoRepository.findByCarritoIdAndProductoId(carrito.getId(), productoId);
        if (itemExistente.isPresent()) {
            ItemCarrito it = itemExistente.get();
            int cantidadTotal = it.getCantidad() + cantidad;

            // Verificar que la cantidad total no exceda el stock
            if (cantidadTotal > producto.getStock()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente. Disponible: %d, Solicitado: %d (ya tienes %d en el carrito)",
                                producto.getStock(), cantidadTotal, it.getCantidad()));
            }

            it.setCantidad(cantidadTotal);
            itemCarritoRepository.save(it);
        } else {
            // Verificar stock para nuevo item
            if (cantidad > producto.getStock()) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente. Disponible: %d, Solicitado: %d",
                                producto.getStock(), cantidad));
            }

            ItemCarrito it = new ItemCarrito();
            it.setCarrito(carrito);
            it.setProducto(producto);
            it.setCantidad(cantidad);
            it.setPrecioUnitario(producto.getPrecio());
            itemCarritoRepository.save(it);
            carrito.getItems().add(it);
        }
        return mapperCarrito.toDTO(carrito);
    }

    @Override
    public CarritoDTO actualizarCantidad(Long usuarioId, Long productoId, int cantidad) {
        if (cantidad < 0)
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Carrito inexistente para el usuario"));

        ItemCarrito it = itemCarritoRepository.findByCarritoIdAndProductoId(carrito.getId(), productoId)
                .orElseThrow(() -> new RecursoNoEncontrado("El item no existe en el carrito"));

        if (cantidad == 0) { // si la cantidad es 0, eliminamos el item del carrito
            carrito.getItems().remove(it);
            itemCarritoRepository.delete(it);
        } else { // y si no, actualizamos la cantidad
            // Validar stock antes de actualizar
            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado"));

            // Verificar si el producto tiene stock suficiente
            if (producto.getStock() < cantidad) {
                throw new IllegalArgumentException(
                        String.format("Stock insuficiente. Stock disponible: %d, cantidad solicitada: %d",
                                producto.getStock(), cantidad));
            }

            it.setCantidad(cantidad);
            itemCarritoRepository.save(it);
        }
        return mapperCarrito.toDTO(carrito);
    }

    @Override
    public CarritoDTO eliminarItem(Long usuarioId, Long productoId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Carrito inexistente para el usuario"));

        ItemCarrito it = itemCarritoRepository.findByCarritoIdAndProductoId(carrito.getId(), productoId)
                .orElseThrow(() -> new RecursoNoEncontrado("El item no existe en el carrito"));

        carrito.getItems().remove(it);
        itemCarritoRepository.delete(it);

        return mapperCarrito.toDTO(carrito);
    }

    @Override
    public CarritoDTO vaciar(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Carrito inexistente para el usuario"));

        itemCarritoRepository.deleteByCarritoId(carrito.getId());
        carrito.setItems(new ArrayList<>()); // vacio
        return mapperCarrito.toDTO(carrito);
    }

    // de esta forma creamos un carrito asignado a un usuario
    private Carrito crearYGuardarCarrito(Long usuarioId) {
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));
        Carrito c = new Carrito();
        c.setUsuario(u);
        c.setItems(new ArrayList<>());
        return carritoRepository.save(c);
    }
}
