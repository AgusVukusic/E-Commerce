package com.example.uade.tpo.ecommerce_grupo10.service.usuario;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioCreateDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioUpdateDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperUsuario;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final MapperUsuario mapperUsuario;

    @Override
    public UsuarioDTO crear(UsuarioCreateDTO dto) {
        // validaciones
        if (usuarioRepository.existsByUsername(dto.getUsername()))
            throw new IllegalArgumentException("El username ya está en uso");
        if (usuarioRepository.existsByEmail(dto.getEmail()))
            throw new IllegalArgumentException("El email ya está en uso");

        Usuario u = new Usuario();
        u.setUsername(dto.getUsername());
        u.setPassword(dto.getPassword()); // Agregado el password
        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setEmail(dto.getEmail());
        u.setTelefono(dto.getTelefono());
        u.setDireccion(dto.getDireccion());
        u.setRol(dto.getRol());

        Usuario guardado = usuarioRepository.save(u);
        return mapperUsuario.toDTO(guardado);
    }

    @Override
    public UsuarioDTO buscarPorId(Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));
        return mapperUsuario.toDTO(u);
    }

    @Override
    public Optional<UsuarioDTO> buscarPorUsername(String username) {
        return usuarioRepository.findByUsernameIgnoreCase(username)
                .map(mapperUsuario::toDTO);
    }

    @Override
    public Optional<UsuarioDTO> buscarPorEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .map(mapperUsuario::toDTO);
    }

    @Override
    public Page<UsuarioDTO> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(mapperUsuario::toDTO);
    }

    @Override
    public Page<UsuarioDTO> buscar(String parametroBusqueda, Pageable pageable) {
        return usuarioRepository.search(parametroBusqueda, pageable).map(mapperUsuario::toDTO);
    }

    @Override
    public Page<UsuarioDTO> listarPorRol(Rol rol, Pageable pageable) {
        return usuarioRepository.findByRol(rol, pageable).map(mapperUsuario::toDTO);
    }

    @Override
    public UsuarioDTO actualizar(Long id, UsuarioUpdateDTO dto) {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));

        // Si cambia email, validar
        if (!u.getEmail().equalsIgnoreCase(dto.getEmail()) && usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está en uso");
        }

        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setEmail(dto.getEmail());
        u.setTelefono(dto.getTelefono());
        u.setDireccion(dto.getDireccion());
        u.setRol(dto.getRol());

        Usuario actualizado = usuarioRepository.save(u);
        return mapperUsuario.toDTO(actualizado);
    }

    @Override
    public boolean existePorUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    @Override
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

}
