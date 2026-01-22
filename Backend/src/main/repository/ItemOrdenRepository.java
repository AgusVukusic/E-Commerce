package com.example.uade.tpo.ecommerce_grupo10.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.ItemOrden;

@Repository
public interface ItemOrdenRepository extends JpaRepository<ItemOrden, Long> {
    Page<ItemOrden> findByOrdenId(Long ordenId, Pageable pageable);
}
