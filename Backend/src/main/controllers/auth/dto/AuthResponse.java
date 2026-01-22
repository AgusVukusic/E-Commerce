package com.example.uade.tpo.ecommerce_grupo10.controllers.auth.dto;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    @JsonProperty("access_token")
    private String token;

    @JsonProperty("user")
    private UserInfo user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String nombre;
        private String apellido;
        private String telefono;
        private String direccion;
        private Rol rol;
    }
}
