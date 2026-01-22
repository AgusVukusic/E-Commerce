package com.example.uade.tpo.ecommerce_grupo10.service.producto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;
import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.ProductoDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperProducto;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.CategoriaRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.ProductoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;
import com.example.uade.tpo.ecommerce_grupo10.service.security.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SecurityService securityService;
    private final MapperProducto mapperProducto;

    private Categoria getCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RecursoNoEncontrado("Categoria no encontrada"));
    }

    private Usuario getCurrentUser() {
        String email = securityService.getCurrentUserEmail();
        if (email == null) {
            throw new RecursoNoEncontrado("Usuario no autenticado");
        }
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));
    }

    @Override
    public Producto save(ProductoDTO dto) {
        var categoria = getCategoria(dto.getCategoriaId());
        var vendedor = getCurrentUser();
        var entity = mapperProducto.toEntity(dto, categoria, vendedor);
        return productoRepository.save(entity);
    }

    @Override
    public Producto get(Long id) {
        return productoRepository.findById(id).orElseThrow(() -> new RecursoNoEncontrado("Producto no encontrado"));
    }

    @Override
    public Producto update(Long id, ProductoDTO dto) {
        var entity = get(id);
        Categoria cat = (dto.getCategoriaId() != null) ? getCategoria(dto.getCategoriaId()) : entity.getCategoria();
        mapperProducto.updateEntityFromDto(dto, entity, cat);
        return productoRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        var entity = get(id); // lanza excepcion si no existe
        productoRepository.delete(entity);
    }

    // BUSQUEDAS

    @Override
    public Page<Producto> listarDisponibles(Pageable pageable) {
        return productoRepository.findByStockGreaterThan(0, pageable);
    }

    @Override
    public Page<Producto> buscarPorTitulo(String titulo, Pageable pageable) {
        return productoRepository.findByTituloContainingIgnoreCaseAndStockGreaterThan(titulo, 0, pageable);
    }

    @Override
    public Page<Producto> buscarPorCategoria(Long categoriaId, Pageable pageable) {
        return productoRepository.findByCategoriaIdAndStockGreaterThan(categoriaId, 0, pageable);
    }

    @Override
    public Page<ProductoDTO> buscarPorPrecio(Double min, Double max, Pageable pageable) {
        return productoRepository.findByPrecioBetweenAndStockGreaterThan(min, max, 0, pageable)
                .map(mapperProducto::toDTOConDescuentos);
    }

    // MÉTODOS PARA VENDEDORES

    @Override
    public Page<Producto> listarPorVendedor(Long vendedorId, Pageable pageable) {
        return productoRepository.findByVendedorId(vendedorId, pageable);
    }

    @Override
    public Page<Producto> listarDisponiblesPorVendedor(Long vendedorId, Pageable pageable) {
        return productoRepository.findByVendedorIdAndStockGreaterThan(vendedorId, 0, pageable);
    }

    @Override
    public Page<Producto> buscarPorTituloPorVendedor(Long vendedorId, String titulo, Pageable pageable) {
        return productoRepository.findByVendedorIdAndTituloContainingIgnoreCase(vendedorId, titulo, pageable);
    }

    @Override
    public Page<Producto> buscarPorCategoriaPorVendedor(Long vendedorId, Long categoriaId, Pageable pageable) {
        return productoRepository.findByVendedorIdAndCategoriaId(vendedorId, categoriaId, pageable);
    }

    @Override
    public Page<ProductoDTO> buscarPorPrecioPorVendedor(Long vendedorId, Double precioMin, Double precioMax,
            Pageable pageable) {
        return productoRepository.findByVendedorIdAndPrecioBetween(vendedorId, precioMin, precioMax, pageable)
                .map(mapperProducto::toDTOConDescuentos);
    }

}
