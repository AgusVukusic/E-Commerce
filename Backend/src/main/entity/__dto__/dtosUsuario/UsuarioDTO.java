package com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String direccion;
    private Rol rol;
}
