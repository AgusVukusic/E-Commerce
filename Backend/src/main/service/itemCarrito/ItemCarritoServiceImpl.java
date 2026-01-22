package com.example.uade.tpo.ecommerce_grupo10.service.itemCarrito;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ItemCarritoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperItemCarrito;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.ItemCarritoRepository;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
@Transactional
public class ItemCarritoServiceImpl implements ItemCarritoService {
    
    private final ItemCarritoRepository itemCarritoRepository;
    private final MapperItemCarrito mapperItemCarrito;

    @Override
    @Transactional(readOnly = true)
    public ItemCarritoDTO obtener(Long itemId) {
        var it = itemCarritoRepository.findById(itemId)
            .orElseThrow(() -> new RecursoNoEncontrado("ItemCarrito no encontrado"));
        return mapperItemCarrito.toDTO(it);
    }

    @Override
    public void eliminar(Long itemId) {
        if (!itemCarritoRepository.existsById(itemId))
            throw new RecursoNoEncontrado("ItemCarrito no encontrado");
        itemCarritoRepository.deleteById(itemId);
    }
}
