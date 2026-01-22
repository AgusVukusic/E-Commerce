package com.example.uade.tpo.ecommerce_grupo10.service.itemOrden;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemOrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.ItemOrdenRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.OrdenRepository;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class ItemOrdenServiceImpl implements ItemOrdenService {
    
    private final ItemOrdenRepository itemOrdenRepository;
    private final OrdenRepository ordenRepository;
    private final MapperItemOrden mapper;

    // Metodo para validar los items
    private void validar(ItemOrdenDTO dto) {
        if (dto == null) throw new IllegalArgumentException("ItemOrdenDTO no puede ser null");
        if (dto.getIdProducto() == null) throw new IllegalArgumentException("idProducto es obligatorio");
        if (dto.getTitulo() == null || dto.getTitulo().isBlank())
            throw new IllegalArgumentException("titulo es obligatorio");
        if (dto.getCantidad() == null || dto.getCantidad() <= 0)
            throw new IllegalArgumentException("cantidad debe ser > 0");
        if (dto.getPrecioUnitario() == null || dto.getPrecioUnitario() < 0)
            throw new IllegalArgumentException("precioUnitario debe ser >= 0");
        if (dto.getDescuentoAplicado() == null || dto.getDescuentoAplicado() < 0)
            throw new IllegalArgumentException("descuentoAplicado debe ser >= 0");
        if (dto.getDescuentoAplicado() != null && dto.getPrecioUnitario() != null
                && dto.getDescuentoAplicado() > dto.getPrecioUnitario())
            throw new IllegalArgumentException("descuentoAplicado no puede superar precioUnitario");
    }

    // metodo para aplicar cambios parciales, es decir, actualizar solo algunos campos
    private void aplicarCambiosParciales(ItemOrden it, ItemOrdenDTO cambios) {
        if (cambios.getIdProducto() != null) it.setIdProducto(cambios.getIdProducto());
        if (cambios.getTitulo() != null && !cambios.getTitulo().isBlank()) it.setTitulo(cambios.getTitulo());
        if (cambios.getCantidad() != null) {
            if (cambios.getCantidad() <= 0) throw new IllegalArgumentException("cantidad debe ser > 0");
            it.setCantidad(cambios.getCantidad());
        }
        if (cambios.getPrecioUnitario() != null) {
            if (cambios.getPrecioUnitario() < 0) throw new IllegalArgumentException("precioUnitario debe ser >= 0");
            it.setPrecioUnitario(cambios.getPrecioUnitario());
        }
        if (cambios.getDescuentoAplicado() != null) {
            if (cambios.getDescuentoAplicado() < 0)
                throw new IllegalArgumentException("descuentoAplicado debe ser >= 0");
            if (cambios.getPrecioUnitario() != null && cambios.getDescuentoAplicado() > cambios.getPrecioUnitario())
                throw new IllegalArgumentException("descuentoAplicado no puede superar precioUnitario");
            // Si precioUnitario no viene en 'cambios', validamos contra el actual:
            if (cambios.getPrecioUnitario() == null && cambios.getDescuentoAplicado() > it.getPrecioUnitario())
                throw new IllegalArgumentException("descuentoAplicado no puede superar precioUnitario");
            it.setDescuentoAplicado(cambios.getDescuentoAplicado());
        }
        // permitir mover el item a otra orden (opcional)
        if (cambios.getOrdenId() != null) {
            Orden nuevaOrden = ordenRepository.findById(cambios.getOrdenId())
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + cambios.getOrdenId()));
            it.setOrden(nuevaOrden);
        }
    }

    // Ahora si, implementacion de los metodos del servicio
    @Override
    @Transactional // transactional hace que todos los cambios a la base de datos se realicen en una sola transaccion,
    // lo que permite deshacer todos los cambios si ocurre un error
    public ItemOrdenDTO crear(ItemOrdenDTO dto) {
        validar(dto); // primero validamos

        Orden orden = null;
        if (dto.getOrdenId() != null) {
            orden = ordenRepository.findById(dto.getOrdenId())
                    .orElseThrow(() -> new RecursoNoEncontrado("Orden no encontrada: " + dto.getOrdenId()));
        }

        ItemOrden item = mapper.toEntity(dto, orden);
        ItemOrden guardado = itemOrdenRepository.save(item);
        return mapper.toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemOrdenDTO obtenerPorId(Long id) {
        ItemOrden it = itemOrdenRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("ItemOrden no encontrado: " + id));
        return mapper.toDTO(it);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemOrdenDTO> listar(Pageable pageable) {
        return itemOrdenRepository.findAll(pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemOrdenDTO> listarPorOrden(Long ordenId, Pageable pageable) {
        return itemOrdenRepository.findByOrdenId(ordenId, pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional
    public ItemOrdenDTO actualizar(Long id, ItemOrdenDTO cambiosParciales) {
        ItemOrden it = itemOrdenRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("ItemOrden no encontrado: " + id));

        aplicarCambiosParciales(it, cambiosParciales);
        ItemOrden actualizado = itemOrdenRepository.save(it);
        return mapper.toDTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        itemOrdenRepository.deleteById(id);
    }
}
