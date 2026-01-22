package com.example.uade.tpo.ecommerce_grupo10.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long>{

    // metodo para verificar si existe una categoria por nombre
    boolean existsByNombre(String nombre);

}