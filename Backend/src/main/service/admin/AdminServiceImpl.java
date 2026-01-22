package com.example.uade.tpo.ecommerce_grupo10.service.admin;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__.MapperUsuario;
import com.example.uade.tpo.ecommerce_grupo10.exceptions.RecursoNoEncontrado;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;
import com.example.uade.tpo.ecommerce_grupo10.service.security.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UsuarioRepository usuarioRepository;
    private final MapperUsuario mapperUsuario;
    private final SecurityService securityService;

    @Override
    public UsuarioDTO promoverAAdmin(Long usuarioId) {
        // Verificar que el usuario actual es ADMIN
        if (!securityService.isAdmin()) {
            throw new IllegalArgumentException("Solo un ADMIN puede promover a otros usuarios");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));

        // Verificar que el usuario no sea ya ADMIN
        if (usuario.getRol() == Rol.ADMIN) {
            throw new IllegalArgumentException("El usuario ya es ADMIN");
        }

        // Solo se puede promover a VENDEDORES a ADMIN
        if (usuario.getRol() != Rol.VENDEDOR) {
            throw new IllegalArgumentException("Solo se puede promover a VENDEDORES a ADMIN");
        }

        usuario.setRol(Rol.ADMIN);
        Usuario savedUsuario = usuarioRepository.save(usuario);

        return mapperUsuario.toDTO(savedUsuario);
    }

    @Override
    public UsuarioDTO degradarAdmin(Long usuarioId) {
        // Verificar que el usuario actual es ADMIN
        if (!securityService.isAdmin()) {
            throw new IllegalArgumentException("Solo un ADMIN puede degradar a otros ADMINs");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario no encontrado"));

        // Verificar que el usuario sea ADMIN
        if (usuario.getRol() != Rol.ADMIN) {
            throw new IllegalArgumentException("El usuario no es ADMIN");
        }

        // No permitir que un ADMIN se degrade a sí mismo si es el único ADMIN
        String currentUserEmail = securityService.getCurrentUserEmail();
        Usuario currentUser = usuarioRepository.findByEmailIgnoreCase(currentUserEmail)
                .orElseThrow(() -> new RecursoNoEncontrado("Usuario actual no encontrado"));

        if (currentUser.getId().equals(usuarioId)) {
            long adminCount = usuarioRepository.countByRol(Rol.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalArgumentException("No puede degradarse a sí mismo siendo el único ADMIN");
            }
        }

        usuario.setRol(Rol.VENDEDOR);
        Usuario savedUsuario = usuarioRepository.save(usuario);

        return mapperUsuario.toDTO(savedUsuario);
    }

    @Override
    public boolean puedeGestionarAdmins() {
        return securityService.isAdmin();
    }
}
