package com.example.uade.tpo.ecommerce_grupo10.service.descuentoProducto;

import java.util.Date;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.DescuentoProducto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.DescuentoProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperDescuentoProducto;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.DescuentoProductoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.ProductoRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DescuentoProductoServiceImpl implements DescuentoProductoService {

    private static final Logger logger = LoggerFactory.getLogger(DescuentoProductoServiceImpl.class);

    private final DescuentoProductoRepository descuentoProductoRepository;
    private final ProductoRepository productoRepository;
    private final MapperDescuentoProducto mapperDescuentoProducto;

    @PersistenceContext
    private EntityManager entityManager;

    // crear descuento
    @Override
    public DescuentoProductoDTO crear(Long productoId, DescuentoProductoDTO dto) {
        logger.info("Creando descuento para producto ID: {}", productoId);
        logger.debug("Datos del descuento: porcentaje={}%, fechaInicio={}, fechaFin={}, activo={}",
                dto.getPorcentajeDescuento(), dto.getFechaInicio(), dto.getFechaFin(), dto.getActivo());

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado id=" + productoId));

        // Normalizar fechas para evitar problemas de zona horaria
        normalizarFechas(dto);

        validarDTO(dto); // validamos la entidad del descuento para ver si es valido

        DescuentoProducto entity = descuentoProductoRepository.findByProductoId(productoId)
                .orElse(mapperDescuentoProducto.toEntity(dto, producto));

        if (entity.getId() != null) { // si ya existe un descuento para este producto, actualizamos
            logger.info("Ya existe un descuento para el producto ID {}, actualizando...", productoId);
            mapperDescuentoProducto.updateEntityFromDTO(dto, entity, producto);
        } else {
            logger.info("Creando nuevo descuento para el producto ID {}", productoId);
        }

        // Establecer la relación bidireccional
        entity.setProducto(producto);
        producto.setDescuento(entity);

        DescuentoProducto guardado = descuentoProductoRepository.save(entity);

        // Guardar también el producto para asegurar que la relación se persiste
        productoRepository.save(producto);

        // Forzar flush para asegurar que los cambios se escriban inmediatamente en la
        // BD
        entityManager.flush();
        entityManager.clear();

        logger.info("Descuento guardado exitosamente con ID: {} para producto ID: {}", guardado.getId(), productoId);

        return mapperDescuentoProducto.toDTO(guardado);
    }

    // obtener por id
    @Override
    @Transactional(readOnly = true)
    public DescuentoProductoDTO obtenerPorId(Long id) {
        return descuentoProductoRepository.findById(id)
                .map(mapperDescuentoProducto::toDTO)
                .orElseThrow(() -> new RecursoNoEncontrado("Descuento no encontrado id=" + id));
    }

    // obtener los descuentos por producto
    @Override
    @Transactional(readOnly = true)
    public DescuentoProductoDTO obtenerPorProducto(Long productoId) {
        return descuentoProductoRepository.findByProductoId(productoId)
                .map(mapperDescuentoProducto::toDTO)
                .orElseThrow(
                        () -> new RecursoNoEncontrado("El producto id=" + productoId + " no tiene descuento"));
    }

    // obtener los descuentos por producto sin lanzar excepción
    @Override
    @Transactional(readOnly = true)
    public Optional<DescuentoProductoDTO> obtenerPorProductoOptional(Long productoId) {
        logger.debug("Consultando descuento para producto ID: {}", productoId);
        return descuentoProductoRepository.findByProductoId(productoId)
                .map(mapperDescuentoProducto::toDTO);
    }

    // listar con paginacion
    @Override
    @Transactional(readOnly = true)
    public Page<DescuentoProductoDTO> listar(Pageable pageable) {
        return descuentoProductoRepository.findAll(pageable).map(mapperDescuentoProducto::toDTO);
    }

    // actualizar un descuento
    @Override
    public DescuentoProductoDTO actualizar(Long id, DescuentoProductoDTO dto) {
        // Normalizar fechas para evitar problemas de zona horaria
        normalizarFechas(dto);

        validarDTO(dto); // primero lo validamos
        DescuentoProducto entity = descuentoProductoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("Descuento no encontrado id=" + id));

        Producto producto = entity.getProducto();
        if (dto.getProductoId() != null && !dto.getProductoId().equals(producto.getId())) {
            producto = productoRepository.findById(dto.getProductoId())
                    .orElseThrow(
                            () -> new RecursoNoEncontrado("Producto no encontrado id=" + dto.getProductoId()));
        }

        mapperDescuentoProducto.updateEntityFromDTO(dto, entity, producto);

        DescuentoProducto actualizado = descuentoProductoRepository.save(entity);
        entityManager.flush();
        entityManager.clear();

        return mapperDescuentoProducto.toDTO(actualizado);
    }

    @Override
    public DescuentoProductoDTO activar(Long id) {
        DescuentoProducto entity = descuentoProductoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("Descuento no encontrado id=" + id));
        entity.setActivo(true);
        return mapperDescuentoProducto.toDTO(descuentoProductoRepository.save(entity));
    }

    @Override
    public DescuentoProductoDTO desactivar(Long id) {
        DescuentoProducto entity = descuentoProductoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("Descuento no encontrado id=" + id));
        entity.setActivo(false);
        return mapperDescuentoProducto.toDTO(descuentoProductoRepository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        logger.info("Intentando eliminar descuento con ID: {}", id);

        DescuentoProducto descuento = descuentoProductoRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("No se encontró descuento con ID: {}", id);
                    return new RecursoNoEncontrado("Descuento no encontrado id=" + id);
                });

        logger.debug("Descuento encontrado - ID: {}, ProductoID: {}, Porcentaje: {}%, Activo: {}",
                id,
                descuento.getProducto() != null ? descuento.getProducto().getId() : "null",
                descuento.getPorcentajeDescuento(),
                descuento.isActivo());

        // Romper la relación bidireccional antes de eliminar
        if (descuento.getProducto() != null) {
            Producto producto = descuento.getProducto();
            producto.setDescuento(null);
            descuento.setProducto(null);

            productoRepository.save(producto);
            logger.debug("Relación bidireccional rota para producto ID: {}", producto.getId());
        }

        // Eliminar el descuento
        descuentoProductoRepository.delete(descuento);
        entityManager.flush();

        logger.info("Descuento con ID {} eliminado exitosamente", id);
    }

    // Validar que el usuario sea propietario del producto
    @Override
    public void validarPropietarioProducto(Long productoId, String emailUsuario) {
        logger.debug("Validando propietario del producto ID {} para usuario {}", productoId, emailUsuario);

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> {
                    logger.warn("Producto no encontrado con ID: {}", productoId);
                    return new RecursoNoEncontrado("Producto no encontrado id=" + productoId);
                });

        if (producto.getVendedor() == null) {
            logger.error("El producto ID {} no tiene vendedor asignado", productoId);
            throw new IllegalArgumentException("El producto no tiene un vendedor asignado");
        }

        String emailVendedor = producto.getVendedor().getEmail();
        logger.debug("Email del vendedor del producto: {}", emailVendedor);

        if (!emailVendedor.equals(emailUsuario)) {
            logger.warn("Usuario {} intentó gestionar descuento del producto {} que pertenece a {}",
                    emailUsuario, productoId, emailVendedor);
            throw new IllegalArgumentException("No tienes permisos para gestionar descuentos de este producto");
        }

        logger.debug("Validación exitosa: usuario {} es propietario del producto {}", emailUsuario, productoId);
    }

    // Validar que el usuario sea propietario del producto asociado al descuento
    @Override
    public void validarPropietarioDescuento(Long descuentoId, String emailUsuario) {
        DescuentoProducto descuento = descuentoProductoRepository.findById(descuentoId)
                .orElseThrow(() -> new RecursoNoEncontrado("Descuento no encontrado id=" + descuentoId));

        Producto producto = descuento.getProducto();
        if (producto == null) {
            throw new IllegalArgumentException("El descuento no tiene un producto asociado");
        }

        if (producto.getVendedor() == null) {
            throw new IllegalArgumentException("El producto no tiene un vendedor asignado");
        }

        if (!producto.getVendedor().getEmail().equals(emailUsuario)) {
            throw new IllegalArgumentException("No tienes permisos para gestionar este descuento");
        }
    }

    // metodo para validar si el descuento es valido en terminos de valores y fechas
    private void validarDTO(DescuentoProductoDTO dto) {
        if (dto.getPorcentajeDescuento() == null || dto.getPorcentajeDescuento() < 0
                || dto.getPorcentajeDescuento() > 100) {
            throw new IllegalArgumentException("El porcentaje debe estar entre 0 y 100");
        }
        Date ini = dto.getFechaInicio();
        Date fin = dto.getFechaFin();
        if (ini == null || fin == null || !fin.after(ini)) {
            throw new IllegalArgumentException("Rango de fechas inválido (fin debe ser posterior a inicio)");
        }
    }

    /**
     * Normaliza las fechas recibidas del frontend para que el descuento sea válido
     * inmediatamente.
     * El frontend envía fechas en UTC, pero debemos compararlas con la hora local
     * del servidor.
     * Solución: Usar la fecha/hora ACTUAL del servidor como fechaInicio si la fecha
     * recibida
     * está en el futuro (por diferencia de zona horaria).
     */
    private void normalizarFechas(DescuentoProductoDTO dto) {
        Date ahora = new Date();
        Date fechaInicio = dto.getFechaInicio();
        Date fechaFin = dto.getFechaFin();

        // Si la fecha de inicio es futura (por zona horaria), usar la fecha/hora actual
        if (fechaInicio != null && fechaInicio.after(ahora)) {
            long diferenciaMs = fechaInicio.getTime() - ahora.getTime();

            logger.debug("Ajustando fechas por zona horaria. Diferencia: {} ms", diferenciaMs);

            // Usar la hora actual como inicio para que el descuento sea válido
            // inmediatamente
            dto.setFechaInicio(ahora);

            // Ajustar también la fecha fin restando la misma diferencia
            if (fechaFin != null) {
                Date nuevaFechaFin = new Date(fechaFin.getTime() - diferenciaMs);
                dto.setFechaFin(nuevaFechaFin);
            }
        }
    }
}
