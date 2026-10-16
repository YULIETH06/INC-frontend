# Historial de incidentes del frontend

## Descripción

Este documento registra solo los incidentes **importantes** del frontend: los que costó entender por qué pasaban o los que conviene recordar para no repetirlos.

Los errores comunes del día a día (un error de tipos, un import que falta, un ajuste pequeño) no se documentan aquí.

---

# Índice

| # | Incidente | Fecha | Estado |
|---|---|---|---|
| 001 | [Uso duplicado de BrowserRouter](#incidente-001--uso-duplicado-de-browserrouter) | 2026-05-11 | ✅ Resuelto |

---

# Incidente #001 — Uso duplicado de BrowserRouter

## Fecha

2026-05-11

## Descripción del incidente

Durante la configuración de rutas, las vistas no se mostraban correctamente al navegar.

## Error presentado

```txt
Las vistas no se renderizaban correctamente al navegar entre rutas.
```

## Causa identificada

`BrowserRouter` estaba declarado en más de un archivo. React Router solo permite **una** instancia envolviendo toda la aplicación.

## Solución aplicada

Se dejó `BrowserRouter` únicamente en `src/main.tsx`.

```txt
Regla: BrowserRouter solo va en main.tsx
No debe repetirse en: App.tsx, AppRoutes.tsx ni otros componentes
```

## Validación realizada

Al eliminar las instancias duplicadas, las rutas se mostraron correctamente y la navegación volvió a funcionar.

## Resultado final

- Una sola instancia de `BrowserRouter` en `main.tsx`.

## Observaciones

`AppRoutes.tsx` solo debe usar `Routes` y `Route`.

---

# Plantilla para un incidente nuevo

Agregar el incidente al **Índice** y copiar este bloque al final del documento, antes de esta plantilla.

````markdown
# Incidente #00X — Título corto

## Fecha

AAAA-MM-DD

## Descripción del incidente

Qué estaba haciendo y qué pasó.

## Error presentado

```txt
Mensaje exacto del error
```

## Causa identificada

Por qué ocurrió.

## Solución aplicada

Pasos y comandos ejecutados.

## Validación realizada

Cómo se comprobó que quedó resuelto.

## Resultado final

- …

## Observaciones

Qué hacer para que no vuelva a pasar.
````
