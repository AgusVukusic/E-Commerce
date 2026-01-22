package com.example.uade.tpo.ecommerce_grupo10.service.orden;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperOrden;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.ItemOrdenRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.OrdenRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemOrdenRepository itemOrdenRepository;
    private final MapperOrden mapperOrden;

    // Implementación de los métodos del servicio

    // crear una orden
    @Override
    @Transactional
    public OrdenDTO crear(OrdenDTO dto) {
        if (dto == null)
            throw new IllegalArgumentException("OrdenDTO no puede ser null");
        if (dto.getUsuarioId() == null)
            throw new IllegalArgumentException("usuarioId es obligatorio");
        if (dto.getItemIds() == null || dto.getItemIds().isEmpty())
            throw new IllegalArgumentException("Debe incluir al menos un item");

        // primero se resuelven las relaciones
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado: " + dto.getUsuarioId()));

        Set<ItemOrden> items = itemOrdenRepository.findAllById(dto.getItemIds())
                .stream().collect(Collectors.toSet());

        if (items.size() != dto.getItemIds().size()) {
            throw new IllegalArgumentException("Algunos ItemOrden no existen para los IDs provistos");
        }

        // despues armamos la entidad de la orden
        Orden orden = mapperOrden.toEntity(dto, usuario, items);

        // fechaCreacion: si viene null, setear ahora
        if (orden.getFechaCreacion() == null) {
            orden.setFechaCreacion(LocalDateTime.now());
        }

        // calcular total en base a los items (precioUnitario * cantidad)
        double total = items.stream()
                .mapToDouble(it -> {
                    double precio = it.getPrecioUnitario();
                    int cant = it.getCantidad();
                    return precio * cant;
                })
                .sum();
        orden.setTotal(total);

        // setear relacion
        items.forEach(it -> it.setOrden(orden));

        // gaurdar
        Orden guardada = ordenRepository.save(orden);

        // devolver DTO
        return mapperOrden.toDTO(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenDTO obtenerPorId(Long id) {
        Orden o = ordenRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("Orden no encontrada: " + id));
        return mapperOrden.toDTO(o);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrdenDTO> listar(Pageable pageable) {
        return ordenRepository.findAll(pageable).map(mapperOrden::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrdenDTO> listarPorUsuario(Long usuarioId, Pageable pageable) {
        return ordenRepository.findByUsuarioId(usuarioId, pageable).map(mapperOrden::toDTO);
    }

    @Override
    @Transactional
    public OrdenDTO actualizarEstado(Long id, String nuevoEstado) {
        Orden o = ordenRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontrado("Orden no encontrada: " + id));

        if (nuevoEstado == null || nuevoEstado.isBlank())
            throw new IllegalArgumentException("El estado no puede ser vacío");

        o.setEstado(nuevoEstado.trim().toUpperCase()); // tipo enum
        return mapperOrden.toDTO(ordenRepository.save(o));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        try {
            ordenRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            // id inexistente
            // lo que hace es devolver 204 aunque el recurso no exista
        }
    }
}
