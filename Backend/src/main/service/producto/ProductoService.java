package com.example.uade.tpo.ecommerce_grupo10.service.producto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ProductoDTO;

public interface ProductoService {

    public Producto save(ProductoDTO dto);

    public Producto get(Long id); // se utiliza Optional para manejar el caso en que no se encuentra el producto
                                  // en la base de datos

    public Producto update(Long id, ProductoDTO dto);

    public void delete(Long id);

    Page<Producto> listarDisponibles(Pageable pageable); // productos con stock > 0

    Page<Producto> buscarPorTitulo(String titulo, Pageable pageable); // stock > 0

    Page<Producto> buscarPorCategoria(Long categoriaId, Pageable pageable); // stock > 0

    Page<ProductoDTO> buscarPorPrecio(Double precioMin, Double precioMax, Pageable pageable); // stock > 0

    // Métodos para vendedores (sus propios productos)
    Page<Producto> listarPorVendedor(Long vendedorId, Pageable pageable); 

    Page<Producto> listarDisponiblesPorVendedor(Long vendedorId, Pageable pageable); // productos del vendedor con stock
                                                                                     // > 0

    Page<Producto> buscarPorTituloPorVendedor(Long vendedorId, String titulo, Pageable pageable);

    Page<Producto> buscarPorCategoriaPorVendedor(Long vendedorId, Long categoriaId, Pageable pageable);

    Page<ProductoDTO> buscarPorPrecioPorVendedor(Long vendedorId, Double precioMin, Double precioMax,
            Pageable pageable);

}
