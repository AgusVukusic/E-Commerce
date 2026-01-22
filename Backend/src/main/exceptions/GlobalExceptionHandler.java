package com.example.uade.tpo.ecommerce_grupo10.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = Map.of(
                "message", "Credenciales inválidas",
                "status", "unauthorized");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body); // 401
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        logger.warn("IllegalArgumentException: {}", ex.getMessage());
        Map<String, Object> body = Map.of(
                "message", ex.getMessage(),
                "status", "bad_request");
        return ResponseEntity.badRequest().body(body); // 400
    }

    @ExceptionHandler(RecursoNoEncontrado.class)
    public ResponseEntity<Map<String, Object>> handleRecursoNoEncontrado(RecursoNoEncontrado ex) {
        logger.warn("RecursoNoEncontrado: {}", ex.getMessage());
        Map<String, Object> body = Map.of(
                "message", ex.getMessage(),
                "status", "not_found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body); // 404
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage()))
                .toList();

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Datos inválidos");
        body.put("status", "validation_error");
        body.put("errors", errors);

        return ResponseEntity.badRequest().body(body); // 400
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        logger.error("Error no manejado: {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Error interno del servidor: " + ex.getMessage());
        body.put("status", "error");
        body.put("type", ex.getClass().getSimpleName());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body); // 500
    }
}
