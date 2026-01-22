package com.example.uade.tpo.ecommerce_grupo10.service.wishlist;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.WishlistDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperWishlist;
import com.example.uade.tpo.ecommerce_grupo10.entity.wishlist.Wishlist;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.WishlistItemRepository;
import com.example.uade.tpo.ecommerce_grupo10.repository.WishlistRepository;

import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class WishlistServiceImpl implements WishlistService{
    
    private final WishlistRepository wishlistRepo;
    private final WishlistItemRepository wishlistItemRepo;
    private final UsuarioRepository usuarioRepo;
    private final MapperWishlist mapperWishlist;

    @Override
    public WishlistDTO getOrCreateByUsuario(Long usuarioId) {
        Wishlist wishlist = wishlistRepo.findByUsuarioId(usuarioId)
                .orElseGet(() -> { // si no existe, creo una nueva
                    Usuario u = usuarioRepo.findById(usuarioId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
                    Wishlist w = new Wishlist();
                    w.setUsuario(u);
                    return wishlistRepo.save(w);
                });
        return mapperWishlist.toDTO(wishlist);
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistDTO getByUsuario(Long usuarioId) {
        Wishlist wishlist = wishlistRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist no encontrada para el usuario"));
        return mapperWishlist.toDTO(wishlist);
    }

    @Override
    public void clearByUsuario(Long usuarioId) {
        Wishlist wishlist = wishlistRepo.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist no encontrada para el usuario"));
        // borro todos los items de esa wishlist
        wishlistItemRepo.findAllByWishlistId(wishlist.getId())
                        .forEach(it -> wishlistItemRepo.deleteById(it.getId()));
    }

}
