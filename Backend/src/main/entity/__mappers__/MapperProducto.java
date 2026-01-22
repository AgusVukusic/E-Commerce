package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;
import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ImagenProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.descuentoProducto.DescuentoProductoService;

@Component
public class MapperProducto {

    private static final Logger logger = LoggerFactory.getLogger(MapperProducto.class);

    @Autowired
    private DescuentoProductoService descuentoProductoService;

    @Autowired
    private MapperImagenProducto mapperImagenProducto;

    // metodo que convierte un Producto a ProductoDTO (sin descuentos)
    public ProductoDTO toDTO(Producto p) {
        if (p == null)
            return null;

        // Convertir las imágenes a DTOs
        List<ImagenProductoDTO> imagenesDTO = p.getImagenes() != null ? p.getImagenes().stream()
                .map(mapperImagenProducto::toDTO)
                .collect(Collectors.toList()) : List.of();

        return ProductoDTO.builder()
                .id(p.getId())
                .titulo(p.getTitulo())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .imagenUrl(p.getImagenUrl())
                .categoriaId(p.getCategoria() != null ? p.getCategoria().getId() : null)
                .categoriaNombre(p.getCategoria() != null ? p.getCategoria().getNombre() : null)
                .vendedorId(p.getVendedor() != null ? p.getVendedor().getId() : null)
                .vendedorNombre(p.getVendedor() != null ? p.getVendedor().getNombre() : null)
                .imagenes(imagenesDTO)
                .tieneDescuento(false)
                .build();
    }

    // metodo que convierte un Producto a ProductoDTO (con información de
    // descuentos)
    public ProductoDTO toDTOConDescuentos(Producto p) {
        if (p == null)
            return null;

        ProductoDTO dto = toDTO(p);

        try {
            logger.debug("Buscando descuento para producto ID: {}", p.getId());

            // SIEMPRE consultar la base de datos para obtener el descuento más reciente
            Optional<DescuentoProductoDTO> descuentoOpt = descuentoProductoService
                    .obtenerPorProductoOptional(p.getId());

            if (descuentoOpt.isPresent()) {
                DescuentoProductoDTO descuento = descuentoOpt.get();

                logger.debug(
                        "Descuento encontrado para producto ID {}: id={}, activo={}, porcentaje={}, fechaInicio={}, fechaFin={}",
                        p.getId(), descuento.getId(), descuento.getActivo(), descuento.getPorcentajeDescuento(),
                        descuento.getFechaInicio(), descuento.getFechaFin());

                // Verificar si está activo
                if (!Boolean.TRUE.equals(descuento.getActivo())) {
                    logger.debug("Descuento para producto ID {} no está activo", p.getId());
                    return dto;
                }

                // Verificar si está vigente
                if (!estaVigente(descuento)) {
                    logger.debug("Descuento para producto ID {} no está vigente", p.getId());
                    return dto;
                }

                // Verificar porcentaje válido
                if (descuento.getPorcentajeDescuento() == null || descuento.getPorcentajeDescuento() <= 0) {
                    logger.warn("Descuento para producto ID {} tiene porcentaje inválido: {}",
                            p.getId(), descuento.getPorcentajeDescuento());
                    return dto;
                }

                // Calcular y aplicar el descuento
                double porcentaje = descuento.getPorcentajeDescuento();
                double montoDescuento = p.getPrecio() * (porcentaje / 100.0);
                double precioConDescuento = p.getPrecio() - montoDescuento;

                dto.setTieneDescuento(true);
                dto.setPorcentajeDescuento(porcentaje);
                dto.setMontoDescuento(montoDescuento);
                dto.setPrecioConDescuento(precioConDescuento);

                logger.debug("Descuento aplicado al producto ID {}: {}%", p.getId(), porcentaje);
            } else {
                logger.debug("No hay descuento para producto ID: {}", p.getId());
            }
        } catch (Exception e) {
            logger.error("Error al procesar descuento para producto ID {}: {}", p.getId(), e.getMessage(), e);
        }

        return dto;
    }

    // Método auxiliar para verificar si un descuento está vigente
    private boolean estaVigente(DescuentoProductoDTO descuento) {
        Date ahora = new Date();

        if (descuento.getFechaInicio() == null || descuento.getFechaFin() == null) {
            logger.warn("Descuento con fechas nulas: fechaInicio={}, fechaFin={}",
                    descuento.getFechaInicio(), descuento.getFechaFin());
            return false;
        }

        boolean despuesDeInicio = !ahora.before(descuento.getFechaInicio());
        boolean antesDelFin = !ahora.after(descuento.getFechaFin());

        logger.debug("Verificación de vigencia: ahora={}, inicio={}, fin={}, resultado={}",
                ahora, descuento.getFechaInicio(), descuento.getFechaFin(), (despuesDeInicio && antesDelFin));

        return despuesDeInicio && antesDelFin;
    }

    public void updateEntityFromDto(ProductoDTO dto, Producto entity, Categoria categoria) {
        if (dto.getTitulo() != null)
            entity.setTitulo(dto.getTitulo());
        if (dto.getDescripcion() != null)
            entity.setDescripcion(dto.getDescripcion());
        if (dto.getPrecio() != null)
            entity.setPrecio(dto.getPrecio());
        if (dto.getStock() != null)
            entity.setStock(dto.getStock());
        if (dto.getImagenUrl() != null)
            entity.setImagenUrl(dto.getImagenUrl());
        if (categoria != null)
            entity.setCategoria(categoria);
    }

    public void updateEntityFromDto(ProductoDTO dto, Producto entity, Categoria categoria, Usuario vendedor) {
        updateEntityFromDto(dto, entity, categoria);
        if (vendedor != null)
            entity.setVendedor(vendedor);
    }

    public Producto toEntity(ProductoDTO dto, Categoria categoria) {
        Producto p = new Producto();
        updateEntityFromDto(dto, p, categoria);
        return p;
    }

    public Producto toEntity(ProductoDTO dto, Categoria categoria, Usuario vendedor) {
        Producto p = new Producto();
        updateEntityFromDto(dto, p, categoria, vendedor);
        return p;
    }
}
