package com.example.uade.tpo.ecommerce_grupo10.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.Orden;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    
    Page<Orden> findByUsuarioId(Long usuarioId, Pageable pageable);
    Page<Orden> findByEstado(String estado, Pageable pageable);

}
