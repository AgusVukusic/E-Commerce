package com.example.uade.tpo.ecommerce_grupo10.service.categoria;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    CategoriaRepository categoriaRepository;
    
    // METODOS DE LECTURA

    @Override
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    @Override
    public Page<Categoria> listar(Pageable pageable) {
        return categoriaRepository.findAll(pageable);
    }

    @Override
    public Categoria obtenerPorId(Long id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new RecursoNoEncontrado("Categoria " + id + " no encontrada"));
    }


    // METODOS DE ESCRITURA

    @Override
    public Categoria crear(Categoria categoria) {
        // hago unas sim
        if (categoria.getNombre() == null || categoria.getNombre().isBlank())
            throw new IllegalArgumentException("El nombre de la categoria no puede ser nulo o vacio");
        if (categoriaRepository.existsByNombre(categoria.getNombre()))
            throw new IllegalArgumentException("Ya existe una categoria con el nombre " + categoria.getNombre());
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria actualizar(Long id, Categoria categoria) {
        Categoria existente = obtenerPorId(id);

        // validamos
        if (categoria.getNombre() != null && !categoria.getNombre().isBlank() && !categoria.getNombre().equals(existente.getNombre())) {
            if (categoriaRepository.existsByNombre(categoria.getNombre()))
                throw new IllegalArgumentException("Ya existe una categoria con el nombre " + categoria.getNombre());
            existente.setNombre(categoria.getNombre());
        }
        return categoriaRepository.save(existente);
    }

    @Override
    public void eliminar(Long id) {
        Categoria existente = obtenerPorId(id);
        categoriaRepository.delete(existente);
    }

    // METODO UTIL

    @Override
    public boolean existsPorNombre(String nombre) {
        return categoriaRepository.existsByNombre(nombre);
    }


}
