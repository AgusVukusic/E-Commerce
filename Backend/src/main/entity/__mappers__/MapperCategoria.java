package com.example.uade.tpo.ecommerce_grupo10.entity.__mappers__;

import com.example.uade.tpo.ecommerce_grupo10.entity.Categoria;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.CategoriaDTO;

public class MapperCategoria {
    
    private MapperCategoria() {
        // Constructor privado
    }

    public static CategoriaDTO toDTO(Categoria c) {
        return new CategoriaDTO(
            c.getId(),
            c.getNombre()
        );
    }

    public static Categoria toEntity(CategoriaDTO dto) {
        Categoria c = new Categoria();
        c.setId(dto.getId());
        c.setNombre(dto.getNombre());
        // no seteamos productos aca porque se maneja desde Producto
        return c;
    }
}
