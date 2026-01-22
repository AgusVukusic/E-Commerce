package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;

@Component // component es para que Spring lo reconozca como un bean
public class MapperUsuario {
    
    public UsuarioDTO toDTO(Usuario u) {
        if (u == null)
            return null;
        return UsuarioDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .email(u.getEmail())
                .telefono(u.getTelefono())
                .direccion(u.getDireccion())
                .rol(u.getRol())
                .build();
    }

    public Usuario toEntity(UsuarioDTO dto) {
        if (dto == null)
            return null;
        Usuario u = new Usuario();
        u.setId(dto.getId());
        u.setUsername(dto.getUsername());
        u.setNombre(dto.getNombre());
        u.setApellido(dto.getApellido());
        u.setEmail(dto.getEmail());
        u.setTelefono(dto.getTelefono());
        u.setDireccion(dto.getDireccion());
        u.setRol(dto.getRol());
        return u;
    }
}
