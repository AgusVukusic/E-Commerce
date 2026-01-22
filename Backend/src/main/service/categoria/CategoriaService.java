package com.example.uade.tpo.ecommerce_grupo10.service.categoria;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;

public interface CategoriaService {

    // lectura
    List<Categoria> listarTodas();
    Page<Categoria> listar(Pageable pageable);
    Categoria obtenerPorId(Long id);

    // escritura
    Categoria crear(Categoria categoria);
    Categoria actualizar(Long id, Categoria categoria);
    void eliminar(Long id);

    boolean existsPorNombre(String nombre);
    
} 
