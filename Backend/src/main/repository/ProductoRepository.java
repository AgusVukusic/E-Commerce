package com.example.uade.tpo.ecommerce_grupo10.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // catalogo disponible, stock > 0
    Page<Producto> findByStockGreaterThan(int stock, Pageable pageable);

    // Productos por vendedor
    Page<Producto> findByVendedorId(Long vendedorId, Pageable pageable);

    Page<Producto> findByVendedorIdAndStockGreaterThan(Long vendedorId, int stock, Pageable pageable);

    // Busquedas
    Page<Producto> findByTituloContainingIgnoreCaseAndStockGreaterThan(String titulo, int stock, Pageable pageable);

    Page<Producto> findByCategoriaIdAndStockGreaterThan(Long categoriaId, int stock, Pageable pageable);

    Page<Producto> findByPrecioBetweenAndStockGreaterThan(Double precioMin, Double precioMax, int stock,
            Pageable pageable);

    // Busquedas por vendedor
    Page<Producto> findByVendedorIdAndTituloContainingIgnoreCase(Long vendedorId, String titulo, Pageable pageable);

    Page<Producto> findByVendedorIdAndCategoriaId(Long vendedorId, Long categoriaId, Pageable pageable);

    Page<Producto> findByVendedorIdAndPrecioBetween(Long vendedorId, Double precioMin, Double precioMax,
            Pageable pageable);

}
