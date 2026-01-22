package com.example.uade.tpo.ecommerce_grupo10.service.usuario;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioCreateDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioUpdateDTO;

public interface UsuarioService {
    UsuarioDTO crear(UsuarioCreateDTO dto);

    UsuarioDTO buscarPorId(Long id);

    Optional<UsuarioDTO> buscarPorUsername(String username);

    Optional<UsuarioDTO> buscarPorEmail(String email);

    Page<UsuarioDTO> listar(Pageable pageable);

    Page<UsuarioDTO> buscar(String parametroBusqueda, Pageable pageable);

    Page<UsuarioDTO> listarPorRol(Rol rol, Pageable pageable);

    UsuarioDTO actualizar(Long id, UsuarioUpdateDTO dto);

    boolean existePorUsername(String username);

    boolean existePorEmail(String email);
}
