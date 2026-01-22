package com.example.uade.tpo.ecommerce_grupo10.service.wishlistItem;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.uade.tpo.ecommerce_grupo10.entity.Producto;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistItemDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperWishlistItem;
import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.Wishlist;
import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.WishlistItem;
import com.example.uade.tpo.ecommerce_grupo10.repository.ProductoRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.WishlistItemRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.WishlistRepository;
import com.example.uade.tpo.ecommerce_grupo10.service.wishlist.WishlistService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistItemServiceImpl implements WishlistItemService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository itemRepository;
    private final ProductoRepository productoRepository;
    private final WishlistService wishlistService;
    private final MapperWishlistItem mapperWishlistItem;

    @Override
    public List<WishlistItemDTO> listItems(Long usuarioId) {
        // Crear o obtener la wishlist automáticamente
        wishlistService.getOrCreateByUsuario(usuarioId);

        Wishlist wishlist = wishlistRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Wishlist no encontrada para el usuario"));
        return itemRepository.findAllByWishlistId(wishlist.getId())
                .stream() // lo convierto a stream
                .map(mapperWishlistItem::toDTO) // lo convierto a DTO
                .toList(); // y por ultimo a lista para devolver
    }

    @Override
    public WishlistItemDTO addItem(Long usuarioId, Long productoId) {
        // Crear o obtener la wishlist automáticamente
        wishlistService.getOrCreateByUsuario(usuarioId);

        Wishlist wishlist = wishlistRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Wishlist no encontrada para el usuario"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        // Validar stock antes de agregar a la wishlist
        if (producto.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede agregar un producto sin stock a la wishlist");
        }

        boolean exists = itemRepository.existsByWishlistIdAndProductoId(wishlist.getId(), productoId);
        if (exists) { // hago la verificacion para ver si el producto ya existe en la wishlist
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El producto ya está en la wishlist");
        }

        WishlistItem it = new WishlistItem();
        it.setWishlist(wishlist);
        it.setProducto(producto);
        // agregadoA se setea solo por default en la entidad
        it = itemRepository.save(it);
        return mapperWishlistItem.toDTO(it);
    }

    @Override
    public void removeItem(Long usuarioId, Long productoId) {
        Wishlist wishlist = wishlistRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Wishlist no encontrada para el usuario"));

        if (!itemRepository.existsByWishlistIdAndProductoId(wishlist.getId(), productoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item no encontrado en la wishlist");
        }
        itemRepository.deleteByWishlistIdAndProductoId(wishlist.getId(), productoId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exists(Long usuarioId, Long productoId) {
        return wishlistRepository.findByUsuarioId(usuarioId)
                .map(wishlist -> itemRepository.existsByWishlistIdAndProductoId(wishlist.getId(), productoId))
                .orElse(false); // Si no existe la wishlist, retorna false
    }

}
