package com.example.uade.tpo.ecommerce_grupo10.service.checkout;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.CarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemCarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperOrden;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.ItemOrdenRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.OrdenRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.ProductoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;
import com.example.uade.tpo.ecommerce_grupo10.service.carrito.CarritoService;
import com.example.uade.tpo.ecommerce_grupo10.service.descuentoProducto.DescuentoProductoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

    private final CarritoService carritoService;
    private final OrdenRepository ordenRepository;
    private final ItemOrdenRepository itemOrdenRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final MapperOrden mapperOrden;
    private final DescuentoProductoService descuentoProductoService;

    @Override
    public OrdenDTO realizarCheckout(Long usuarioId) {
        // Validar que se pueda realizar checkout
        if (!validarCheckout(usuarioId)) {
            throw new IllegalStateException("No se puede realizar el checkout");
        }

        // Obtener carrito del usuario
        CarritoDTO carritoDTO = carritoService.obtenerPorUsuario(usuarioId);
        if (carritoDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }

        // Validar stock de productos
        validarStock(carritoDTO);

        // Crear la orden
        Orden orden = crearOrdenDesdeCarrito(usuarioId, carritoDTO);

        // Vaciar el carrito
        carritoService.vaciar(usuarioId);

        // Retornar la orden creada
        return mapperOrden.toDTO(orden);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarCheckout(Long usuarioId) {
        try {
            // Verificar que el usuario existe
            if (!usuarioRepository.existsById(usuarioId)) {
                return false;
            }

            // Verificar que tiene carrito y items
            CarritoDTO carrito = carritoService.obtenerPorUsuario(usuarioId);
            if (carrito.getItems().isEmpty()) {
                return false;
            }

            // Verificar stock disponible
            for (ItemCarritoDTO item : carrito.getItems()) {
                Producto producto = productoRepository.findById(item.getProductoId())
                        .orElse(null);
                if (producto == null || producto.getStock() < item.getCantidad()) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void validarStock(CarritoDTO carrito) {
        List<String> errores = new ArrayList<>();

        for (ItemCarritoDTO item : carrito.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado: " + item.getProductoId()));

            if (producto.getStock() < item.getCantidad()) {
                errores.add(String.format("Stock insuficiente para %s. Disponible: %d, Solicitado: %d",
                        producto.getTitulo(), producto.getStock(), item.getCantidad()));
            }
        }

        if (!errores.isEmpty()) {
            throw new IllegalArgumentException("Errores de stock: " + String.join(", ", errores));
        }
    }

    private Orden crearOrdenDesdeCarrito(Long usuarioId, CarritoDTO carrito) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));

        // Crear orden
        Orden orden = new Orden();
        orden.setUsuario(usuario);
        orden.setFechaCreacion(LocalDateTime.now());
        orden.setEstado("PENDIENTE");

        // Guardar orden primero para obtener ID (sin total aún)
        orden = ordenRepository.save(orden);

        // Variable para calcular el total real con descuentos
        double totalConDescuentos = 0.0;

        // Crear items de orden
        for (ItemCarritoDTO itemCarrito : carrito.getItems()) {
            Producto producto = productoRepository.findById(itemCarrito.getProductoId())
                    .orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado"));

            // Calcular descuento aplicable
            double descuentoAplicado = calcularDescuentoAplicable(producto.getId(), itemCarrito.getPrecioUnitario());

            ItemOrden itemOrden = new ItemOrden();
            itemOrden.setOrden(orden);
            itemOrden.setIdProducto(producto.getId());
            itemOrden.setTitulo(producto.getTitulo());
            itemOrden.setCantidad(itemCarrito.getCantidad());
            itemOrden.setPrecioUnitario(itemCarrito.getPrecioUnitario());
            itemOrden.setDescuentoAplicado(descuentoAplicado);

            itemOrdenRepository.save(itemOrden);

            // Calcular subtotal con descuento: (precio - descuento) * cantidad
            double subtotalConDescuento = (itemCarrito.getPrecioUnitario() - descuentoAplicado)
                    * itemCarrito.getCantidad();
            totalConDescuentos += subtotalConDescuento;

            // Actualizar stock del producto
            producto.setStock(producto.getStock() - itemCarrito.getCantidad());
            productoRepository.save(producto);
        }

        // Actualizar el total de la orden con descuentos aplicados y cambiar estado a
        // COMPLETADA
        orden.setTotal(totalConDescuentos);
        orden.setEstado("COMPLETADA");
        orden = ordenRepository.save(orden);

        // Recargar orden con items
        return ordenRepository.findById(orden.getId())
                .orElseThrow(() -> new RecursoNoEncontrado("Error al crear orden"));
    }

    /**
     * Calcula el descuento aplicable para un producto en una fecha específica
     * 
     * @param productoId     ID del producto
     * @param precioUnitario Precio unitario del producto
     * @return Monto del descuento aplicable
     */
    private double calcularDescuentoAplicable(Long productoId, double precioUnitario) {
        try {
            // Intentar obtener el descuento activo para el producto usando el método que no
            // lanza excepción
            Optional<DescuentoProductoDTO> descuentoOpt = descuentoProductoService
                    .obtenerPorProductoOptional(productoId);

            // Si no hay descuento, retornar 0
            if (descuentoOpt.isEmpty()) {
                System.out.println("DEBUG: No hay descuento para producto ID " + productoId);
                return 0.0;
            }

            DescuentoProductoDTO descuento = descuentoOpt.get();

            // Verificar si el descuento existe y no es null
            if (descuento == null) {
                return 0.0;
            }

            // Verificar si el descuento está activo
            if (descuento.getActivo() == null || !descuento.getActivo()) {
                System.out.println("DEBUG: Descuento inactivo para producto ID " + productoId);
                return 0.0;
            }

            // Verificar que el porcentaje de descuento no sea null y sea válido
            if (descuento.getPorcentajeDescuento() == null || descuento.getPorcentajeDescuento() <= 0) {
                System.out.println("DEBUG: Porcentaje de descuento inválido para producto ID " + productoId + ": "
                        + descuento.getPorcentajeDescuento());
                return 0.0;
            }

            // Verificar si el descuento está dentro del rango de fechas
            Date ahora = new Date();
            if (descuento.getFechaInicio() != null && descuento.getFechaFin() != null) {
                if (ahora.before(descuento.getFechaInicio()) || ahora.after(descuento.getFechaFin())) {
                    System.out.println("DEBUG: Descuento fuera del rango de fechas para producto ID " + productoId);
                    return 0.0;
                }
            }

            // Calcular el monto del descuento
            double porcentaje = descuento.getPorcentajeDescuento();
            double montoDescuento = precioUnitario * (porcentaje / 100.0);

            System.out.println("DEBUG: Descuento aplicado a producto ID " + productoId + ": " + montoDescuento + " ("
                    + porcentaje + "%)");
            return montoDescuento;

        } catch (Exception e) {
            // Log de cualquier otro error para debugging
            System.out.println(
                    "DEBUG: Error inesperado calculando descuento para producto " + productoId + ": " + e.getMessage());
            e.printStackTrace();
            return 0.0;
        }
    }
}
