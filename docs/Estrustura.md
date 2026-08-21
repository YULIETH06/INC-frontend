# Documentación de la estructura del proyecto frontend

## 1. Descripción general

Este proyecto frontend está desarrollado con **React**, **TypeScript**, **Vite**, **Material UI**, **React Router DOM** y **Axios**.
La estructura del proyecto está organizada de forma modular para separar responsabilidades, mejorar el mantenimiento del código y permitir la reutilización de componentes en diferentes vistas del sistema.

La idea principal de esta organización es que cada carpeta tenga una función clara dentro del proyecto. De esta manera, las páginas, componentes, servicios, hooks, estilos, rutas y utilidades se mantienen separados y son más fáciles de modificar o ampliar.

---

## 2. Estructura principal del proyecto

```txt
public/
│
├── assets/
│
src/
│
├── api/
├── components/
├── context/
├── data/
├── hooks/
├── interfaces/
├── pages/
├── routes/
├── services/
├── styles/
├── templates/
├── theme/
├── utils/
├── validations/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## 3. Descripción de cada carpeta

### `public/`

La carpeta `public/` contiene archivos estáticos que se sirven directamente desde la raíz del proyecto cuando la aplicación se ejecuta o se compila.

En proyectos desarrollados con Vite, los archivos ubicados dentro de `public/` pueden utilizarse directamente mediante rutas absolutas, sin necesidad de importarlos en los componentes.

**Responsabilidad principal:**

```txt
Guardar archivos públicos que deben estar disponibles directamente para la aplicación.
```

---

### `public/assets/`

La carpeta contiene los recursos gráficos públicos del sistema.

En este proyecto, se utiliza para guardar los logos e íconos principales de la aplicación.

```txt
public/
└── assets/
    ├── logo.png
    ├── logo-blanco.png
    ├── logo-icono.png
    ├── logo-blanco-icono.png
    └── logo-icono-web.png
```

**Responsabilidad principal:**

```txt
Guardar los logos e íconos públicos del sistema.
```

En Vite, los archivos que están dentro de `public/assets/` no se importan con `import`.
Estos archivos se utilizan directamente mediante rutas públicas.

**Se usa en el código como:**

```txt
/assets/logo.png
```

---

### `src/api/`

Esta carpeta contiene la configuración base para la comunicación con el backend.

Aquí se ubican archivos como la instancia de Axios, donde se define la URL base de la API y los interceptores para enviar automáticamente el token de autenticación cuando el usuario ha iniciado sesión.

**Ejemplo de uso:**

```txt
api/
└── axios.ts
```

**Responsabilidad principal:**

```txt
Configurar la conexión HTTP con el backend.
```

---

### `src/components/`

Esta carpeta contiene los componentes visuales del proyecto. Su objetivo principal es organizar la interfaz en piezas reutilizables, evitando repetir código y facilitando el mantenimiento del sistema.

Los componentes se organizan según su nivel de reutilización y el módulo al que pertenecen.

```txt
components/
│
├── common/
│   ├── ActionButton.tsx
│   ├── BulkUploadDialog.tsx
│   ├── ClearableSelect.tsx
│   ├── ConfirmActionDialog.tsx
│   ├── CustomChip.tsx
│   ├── CustomSnackbar.tsx
│   ├── DataTable.tsx
│   ├── EmptyState.tsx
│   ├── FormGrid.tsx
│   ├── FormSection.tsx
│   ├── Header.tsx
│   ├── InfoItem.tsx
│   ├── InfoTooltip.tsx
│   ├── LoadingBox.tsx
│   ├── NotificationBell.tsx
│   ├── PageContainer.tsx
│   ├── PageHeader.tsx
│   ├── ProcessStepper.tsx
│   ├── RadioOptionGroup.tsx
│   ├── SectionCard.tsx
│   ├── SettingsMenu
│   ├── SidebarMenu.tsx
│   ├── StatsSummary.tsx
│   └── ViewToggleButtons.tsx
│
├── humanTalent/
│   ├── candidateSubmission/
│   │   ├── PersonnelRequisitionCandidateCard.tsx
│   │   ├── PersonnelRequisitionCandidateDialog.tsx
│   │   └── PersonnelRequisitionCandidatesSection.tsx
│   │
│   ├── candidateValidation/
│   │   ├── CandidateApplicationConceptStep.tsx
│   │   ├── CandidatePositionValidationStep.tsx
│   │   ├── CandidateRequirementValidationTable.tsx
│   │   ├── CandidateValidationStep.tsx
│   │   └── PersonnelCandidateValidationSection.tsx
│   │
│   ├── requisitionFormat/
│   │   ├── FormatLine.tsx
│   │   ├── FormatOptionBox.tsx
│   │   ├── FormatSectionTitle.tsx
│   │   ├── FormatSignatureBox.tsx
│   │   └── PersonnelRequisitionWatermark.tsx
│   │
│   └── requisitions/
│       ├── PersonnelApprovalCard.tsx
│       ├── PersonnelHiringConfirmationDialog.tsx
│       ├── PersonnelRequisitionListItem.tsx
│       └── PersonnelRequisitionStatusBadge.tsx
│
├── positionManagement/
│   ├── PositionProfileRevisionCard.tsx
│   ├── PositionProfileRevisionDetailSection.tsx
│   ├── PositionProfileRevisionDialog.tsx
│   ├── PositionProfileRevisionsSection.tsx
│   ├── PositionRequirementCard.tsx
│   └── PositionRequirementDescriptionDialog.tsx
│
├── layouts/
│   └── DashboardLayout.tsx
│
├── pqrs/
│   ├── PqrChatView.tsx
│   ├── PqrRatingSummary.tsx
│   └── PqrTicketCard.tsx
│
└── users/
    ├── ChangeUserRoleDialog.tsx
    ├── UserRoleChip.tsx
    └── UserSignatureUploader.tsx
```

---

#### `src/components/common/`

En esta carpeta se ubican los componentes comunes o reutilizables del sistema.
Estos componentes no pertenecen exclusivamente a un módulo, por lo tanto, pueden usarse en diferentes vistas como usuarios, PQR, reportes, roles u otros módulos futuros.

| Componente                | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Reutilización dentro del proyecto                                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BulkUploadDialog.tsx`    | Componente reutilizable para mostrar un modal de carga masiva de archivos. Permite seleccionar o cargar archivos, mostrar información del proceso y ejecutar acciones relacionadas con importaciones.                                                                                                                                                                                                                                                                                                                                                                      | Puede utilizarse en usuarios, PQR, reportes u otros módulos que requieran carga masiva de datos.                                                                                                       |
| `ClearableSelect.tsx`     | Componente reutilizable de selección que permite escoger una opción y también limpiar el valor seleccionado.                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Puede utilizarse en filtros, formularios, búsquedas avanzadas o selección de estados, roles y tipos de PQR.                                                                                            |
| `ActionButton.tsx`        | Componente reutilizable para representar las acciones principales del sistema mediante botones con estilos, íconos y comportamientos consistentes. Permite configurar acciones como guardar, editar, aprobar, rechazar, cancelar, eliminar, visualizar, abrir archivos, cargar archivos, cerrar. También controla estados de carga, texto de ayuda, reemplazo de íconos y adaptación para dispositivos móviles. | Puede utilizarse en formularios, listados, páginas de detalle, diálogos, cargas de archivos y procesos de cualquier módulo.                                         |
| `ConfirmActionDialog.tsx` | Componente reutilizable que muestra un diálogo de confirmación antes de ejecutar una acción importante. Permite recibir mensajes de texto o contenido React, información adicional mediante alertas configurables, tipos de acción como eliminar, cerrar o reabrir, texto personalizado durante la carga y botones consistentes mediante `ActionButton`.                                                     | Puede utilizarse para aprobar, rechazar, cancelar, eliminar, guardar, cerrar, reabrir o confirmar acciones dentro de Talento Humano, PQR, usuarios y otros módulos.                           |
| `CustomChip.tsx`          | Componente reutilizable basado en `Chip` de Material UI. Permite mostrar etiquetas, estados o categorías utilizando colores estándar del tema o colores personalizados mediante propiedades como `customColor`, `backgroundColor`, `textColor` y `borderColor`. Conserva además propiedades como tamaño, variante, ícono, eliminación y estilos adicionales.                                                                                                                                                                                                               | Puede utilizarse para mostrar estados de requisiciones, PQR, préstamos, usuarios, roles, prioridades, categorías o cualquier valor que necesite una identificación visual compacta.                    |
| `CustomSnackbar.tsx`      | Componente reutilizable para mostrar mensajes temporales al usuario, como acciones exitosas, errores, advertencias o información.                                                                                                                                                                                                                                                                                                                                                                                                                                          | Puede utilizarse en cualquier vista que necesite notificar resultados de acciones realizadas.                                                                                                          |
| `DataTable.tsx`           | Componente reutilizable para mostrar información en formato de tabla. Puede recibir columnas, filas y acciones configuradas desde la vista donde se use.                                                                                                                                                                                                                                                                                                                                                                                                                   | Puede utilizarse para listar usuarios, PQR, roles, reportes u otros registros del sistema.                                                                                                             |
| `EmptyState.tsx`          | Componente reutilizable para mostrar un mensaje cuando no existen datos disponibles en una vista.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Puede utilizarse cuando no hay usuarios, PQR, resultados de búsqueda o registros para mostrar.                                                                                                         |
| `FormGrid.tsx`            | Componente reutilizable que organiza campos de formularios mediante CSS Grid. Permite definir columnas responsivas según el tamaño de pantalla.                                                                                                                                                                                                                                                                                                                                                                                                                            | Puede utilizarse en formularios de PQR, Talento Humano, usuarios, reportes u otros módulos que requieran distribuir campos de manera ordenada.                                                         |
| `FormSection.tsx`         | Componente reutilizable que agrupa campos dentro de una sección visual con título y contenedor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Puede utilizarse para dividir formularios en secciones como información principal, motivo, contratación, datos adicionales o resultados.                                                               |
| `Header.tsx`              | Componente reutilizable que representa el encabezado superior de las vistas protegidas. Permite controlar la apertura del menú lateral y mostrar elementos globales como la información del usuario autenticado, las notificaciones y el menú de configuración.                                                                                                                                                                                                                                                                                                            | Se utiliza dentro de `DashboardLayout.tsx` para mantener un encabezado consistente en las páginas internas del sistema.                                                                                |
| `InfoItem.tsx`            | Componente reutilizable para mostrar un dato compuesto por una etiqueta y un valor. Solo se renderiza cuando el valor contiene información y admite texto, componentes, íconos, enlaces o cualquier otro elemento de React.                                                                                                                                                                                                                                                                                                                                                | Puede utilizarse en páginas de detalle de requisiciones, usuarios, préstamos, PQR, reportes y otros módulos que necesiten presentar información en formato etiqueta-valor.                             |
| `InfoTooltip.tsx`         | Componente reutilizable para mostrar información adicional dentro de un panel flotante. Utiliza un botón con ícono informativo y permite configurar título, contenido, posición, alineación, tamaño y etiqueta accesible. Se abre mediante clic o teclado y se cierra al hacer clic afuera, presionar Escape o volver a seleccionar el botón.                                                                                                                                                                                                                              | Puede utilizarse para mostrar motivos de rechazo, explicaciones de campos, ayudas contextuales, aclaraciones, instrucciones o información complementaria sin ocupar espacio permanente en la interfaz. |
| `LoadingBox.tsx`          | Componente reutilizable para mostrar un indicador de carga centrado. Permite configurar la altura mínima del contenedor y el tamaño del indicador según el espacio disponible.                                                                                                                                                                                                                                                                                                                                                                                             | Puede utilizarse en tablas, formularios, secciones, vistas de detalle o cualquier módulo que cargue datos.                                                                                             |
| `NotificationBell.tsx`    | Componente reutilizable que muestra la campana de notificaciones, el contador de notificaciones no leídas y el listado de notificaciones del usuario autenticado.                                                                                                                                                                                                                                                                                                                                                                                                          | Se utiliza dentro de `Header.tsx` para mostrar novedades de módulos como PQR y Talento Humano.                                                                                                         |
| `PageContainer.tsx`       | Componente reutilizable que sirve como contenedor general para organizar el contenido de una página. Ayuda a mantener márgenes, espaciados y estructura visual consistente.                                                                                                                                                                                                                                                                                                                                                                                                | Puede utilizarse en páginas como usuarios, PQR, dashboard, reportes y demás vistas internas.                                                                                                           |
| `PageHeader.tsx`          | Componente reutilizable para mostrar el encabezado particular de una página. Recibe título, subtítulo, acciones principales y contenido adicional mediante `titleAdornment`, lo que permite colocar junto al título elementos como estados, chips, indicadores o ayudas informativas.                                                                                                                                                                                                                                                                                      | Puede utilizarse en listados, formularios y páginas de detalle, como el detalle de una requisición donde se muestra el estado general junto al título.                                                 |
| `ProcessStepper.tsx`      | Componente reutilizable para representar procesos por etapas mediante `Stepper`. Permite definir pasos completados, deshabilitados, etapa activa y navegación controlada entre pasos.                                                                                                                                                                                                                                                                                                                                                         | Puede utilizarse en flujos secuenciales como validaciones, aprobaciones, configuraciones guiadas u otros procesos por etapas.                                                                           |
| `RadioOptionGroup.tsx`    | Componente reutilizable para seleccionar una única opción mediante botones de radio. Permite configurar opciones, valor, estado deshabilitado, mensaje de error, orientación y un `label` opcional.                                                                                                                                                                                                                                                                            | Puede utilizarse en formularios y etapas que necesiten elecciones exclusivas como Sí/No, tipo de cargo, concepto de aplicación u otras opciones cerradas.                                               |
| `SectionCard.tsx`         | Componente reutilizable para agrupar contenido dentro de una tarjeta visual. Admite título, subtítulo, acciones opcionales y contenido adicional mediante `titleAdornment`, permitiendo ubicar junto al título estados, chips o ayudas informativas sin mezclarlos con las acciones del encabezado. Cuando no se requiere encabezado puede utilizarse únicamente como contenedor visual del contenido. | Puede utilizarse en detalles de requisición, formularios, configuraciones, perfiles y reportes.|
| `SettingsMenu.tsx`        | Componente reutilizable encargado de mostrar las opciones personales y de configuración del usuario autenticado mediante un menú desplegable. Centraliza accesos relacionados con el perfil, la firma del usuario y otras configuraciones que puedan agregarse posteriormente.                                                                                                                                                                                                                                                                                             | Se utiliza normalmente desde `Header.tsx` para permitir que el usuario acceda a sus configuraciones sin ocupar espacio permanente dentro del encabezado.                                               |
| `SidebarMenu.tsx`         | Componente reutilizable que representa el menú lateral del sistema. Permite mostrar opciones de navegación según los módulos disponibles y el rol del usuario.                                                                                                                                                                                                                                                                                                                                                                                                             | Se utiliza dentro del layout principal para navegar entre las secciones del sistema.                                                                                                                   |
| `StatsSummary.tsx`        | Componente reutilizable para mostrar tarjetas de resumen con un ícono, una etiqueta y un valor numérico o textual. Permite presentar indicadores importantes de una vista de forma clara y compacta.                                                                                                                                                                                                                                                                                                                                                                       | Puede utilizarse en módulos como PQR, usuarios, dashboard o reportes para mostrar conteos como total de registros, pendientes, cerrados, asignados o por calificar.                                    |
| `ViewToggleButtons.tsx`   | Componente reutilizable para mostrar botones de cambio de vista. Recibe opciones con etiqueta, valor, ícono y contador opcional, permitiendo alternar entre diferentes estados o secciones de una página.                                                                                                                                                                                                                                                                                                                                                                  | Puede utilizarse en vistas que necesiten cambiar entre categorías, por ejemplo PQR disponibles y PQR asignadas, registros activos e inactivos, o diferentes tipos de listado.                          |

El objetivo de `components/common/` es centralizar todos los elementos visuales que pueden servir en varias partes del sistema. Por ejemplo, `DataTable.tsx` no debe ser una tabla exclusiva para usuarios, sino una tabla general que pueda adaptarse a usuarios, PQR, roles o cualquier otro listado.

---

#### `src/components/layouts/`

En esta carpeta se ubican los componentes encargados de definir la estructura visual general de las páginas.

| Componente            | Descripción                                                                                                                                                                | Uso dentro del proyecto                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `DashboardLayout.tsx` | Define la estructura principal de las páginas internas del sistema. Organiza elementos como el header, el sidebar y el área donde se renderiza el contenido de cada vista. | Se utiliza para envolver páginas protegidas como Dashboard, Usuarios, PQR, Reportes u otros módulos internos. |

El layout permite mantener una misma estructura visual en las páginas principales del sistema y evita repetir el mismo diseño en cada vista.

---

#### `src/components/humanTalent/`

En esta carpeta se ubican los componentes visuales específicos del módulo de Talento Humano.

Estos componentes dependen directamente de las requisiciones de personal, sus aprobaciones, la confirmación de contratación, el cargue de candidatos y la generación del formato imprimible.

| Componente                                  | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Uso dentro del proyecto                                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `PersonnelApprovalCard.tsx`                 | Componente encargado de mostrar una aprobación de requisición o confirmación de contratación. Presenta la firma registrada, el nombre del cargo aprobador, la fecha de decisión y un estado pendiente cuando todavía no existe una firma.                                                                                                                                                                                                                                                                                                                                                                                                            | Se utiliza en la página de detalle de requisición para mostrar las aprobaciones del flujo inicial y los vistos buenos de Talento Humano. |
| `PersonnelHiringConfirmationDialog.tsx`     | Componente encargado de mostrar el formulario de confirmación final de contratación. Permite completar los datos definitivos como tipo de contratación, tipo de contrato, duración, tipo de practicante y salario aprobado.                                                                                                                                                                                                                                                                                                                                                                                                                          | Se utiliza cuando Talento Humano debe registrar la información final de contratación de una requisición previamente aprobada.            |
| `PersonnelRequisitionCandidateCard.tsx`     | Componente encargado de mostrar la información de un candidato registrado. Presenta nombre, tipo y número de identificación, fecha, observación, hoja de vida, tamaño del archivo y usuario que realizó el cargue. Siempre permite consultar la hoja de vida, pero las acciones de editar y eliminar solo se muestran cuando el cargue permanece abierto y el usuario tiene permiso para gestionarlo.                                                                                                                                                                                                                                                | Se utiliza dentro de la sección de candidatos en el detalle de una requisición.                                                          |
| `PersonnelRequisitionCandidateDialog.tsx`   | Diálogo utilizado para registrar o actualizar candidatos. Permite seleccionar el tipo de identificación, diligenciar el número de identificación, nombre, observación opcional y seleccionar o reemplazar la hoja de vida. Muestra errores de validación, archivo actual o seleccionado y estados de carga.                                                                                                                                                                                                                                                                                                                                          | Se utiliza desde la sección de candidatos cuando el cargue se encuentra abierto.                                                         |
| `PersonnelRequisitionCandidatesSection.tsx` | Componente contenedor encargado de consultar, presentar y gestionar los candidatos de una requisición. Muestra el estado del cargue, el contador máximo de **10 candidatos**, formularios y acciones de cierre o reapertura. La fecha límite de la presentación inicial se muestra para todos los usuarios mediante un `InfoTooltip` ubicado junto al título **Candidatos**. Si el primer cierre ocurre después del plazo, solicita una justificación; cada reapertura exige un motivo. Muestra la sección **Historial del cargue** únicamente cuando existe al menos un registro de reapertura o cierre posterior. | Se integra en `PersonnelRequisitionDetail.tsx` cuando el proceso de candidatos ya fue iniciado y coordina visualmente el plazo inicial, el cierre, las reaperturas y su trazabilidad. |
| `PersonnelRequisitionListItem.tsx`          | Componente encargado de mostrar una requisición en formato de tarjeta o elemento de lista. Presenta cargo, estado, área, ciudad, salario, tipo de contratación, fecha, solicitante, responsable actual y acciones disponibles según los permisos del usuario.                                                                                                                                                                                                                                                                                                                                                                                        | Se utiliza en el listado general de requisiciones para consultar, aprobar, rechazar, confirmar contratación o ingresar al detalle.       |
| `PersonnelRequisitionStatusBadge.tsx`       | Componente encargado de mostrar el estado general de una requisición mediante un `CustomChip`. Cuando el estado es rechazado o cancelado y existe un comentario, muestra también un `InfoTooltip` con el motivo correspondiente.                                                                                                                                                                                                                                                                                                                                                                                                                     | Se utiliza junto al título de la página de detalle para identificar rápidamente el estado general de la requisición.                     |

**Comportamiento visual actual del cargue de candidatos:**

```txt
Cargue inicial habilitado
↓
InfoTooltip junto a “Candidatos” con la fecha límite
↓
Primer cierre dentro del plazo → no solicita justificación
Primer cierre vencido → solicita lateReason
↓
Reapertura → reason obligatorio
↓
Historial del cargue → solo se muestra si existe al menos un registro
```

El primer cierre permanece almacenado aunque el cargue sea reabierto. La sección de historial representa únicamente movimientos posteriores a esa presentación inicial.

---


##### `src/components/humanTalent/candidateValidation/`

Esta subcarpeta contiene los componentes específicos del proceso **Validación de cargo y postulante**.

```txt
components/humanTalent/candidateValidation/
├── CandidateApplicationConceptStep.tsx
├── CandidatePositionValidationStep.tsx
├── CandidateRequirementValidationTable.tsx
├── CandidateValidationStep.tsx
└── PersonnelCandidateValidationSection.tsx
```

| Componente | Descripción | Uso dentro del proyecto |
| ---------- | ----------- | ----------------------- |
| `CandidateApplicationConceptStep.tsx` | Representa la **Fase 1: Concepto de aplicación**. Permite seleccionar `Ingreso` o `Modificación de cargo`, muestra los errores de validación correspondientes y permite guardar para habilitar la siguiente fase. | Se renderiza desde `PersonnelCandidateValidationSection.tsx` cuando la primera etapa está activa. |
| `CandidatePositionValidationStep.tsx` | Representa la **Fase 2: Validación de cargo**. Muestra información de la revisión utilizada, permite clasificar el proceso como `Nuevo cargo` o `Cargo existente`, solicita el código de control de cambios cuando corresponde y, para cargo existente, presenta si el perfil de cargo utilizado continúa vigente. | Se renderiza después de completar la Fase 1. |
| `CandidateRequirementValidationTable.tsx` | Tabla reutilizable dentro del flujo de validación. Agrupa las descripciones por requerimiento y permite evaluar cada descripción de forma independiente. Si el candidato cumple, solicita evidencia; si no cumple, solicita el cierre de brecha. | Se utiliza dentro de `CandidateValidationStep.tsx` para presentar de forma compacta Formación, Experiencia y Conocimientos específicos, incluyendo múltiples descripciones por requisito. |
| `CandidateValidationStep.tsx` | Representa la **Fase 3: Validación del postulante**. Agrupa las descripciones de la revisión exacta utilizada por la requisición, delega su evaluación a `CandidateRequirementValidationTable.tsx`, solicita el resultado final de aptitud y muestra la fecha y el usuario que realizó la validación cuando el proceso fue completado. | Se renderiza después de completar la Fase 2. |
| `PersonnelCandidateValidationSection.tsx` | Componente coordinador del detalle. Consulta el hook de validación, muestra el `ProcessStepper`, la información general del cargo y del candidato, controla la etapa activa y delega cada fase a su componente correspondiente. También presenta estados de carga, errores, estado vacío y mensajes mediante snackbar. | Se utiliza en la página `PersonnelCandidateValidationDetail.tsx`. |

---

##### `src/components/humanTalent/requisitionFormat/`

Esta subcarpeta contiene los componentes específicos utilizados para construir el formato imprimible de una requisición.

Se mantienen separados de los componentes normales del detalle porque utilizan dimensiones, tipografías y estilos optimizados para impresión.

| Componente                          | Descripción                                                                                                                                                                                                                                             | Uso dentro del proyecto                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FormatLine.tsx`                    | Componente reutilizable dentro del formato para mostrar una etiqueta y su valor sobre una línea inferior. Permite configurar el ancho reservado para la etiqueta.                                                                                       | Se utiliza para mostrar datos como fecha, área, cargo, ciudad, solicitante y salarios dentro del documento imprimible.                           |
| `FormatOptionBox.tsx`               | Componente que representa una casilla visual dentro del formato. Muestra una `X` cuando una opción se encuentra seleccionada.                                                                                                                           | Se utiliza para representar motivos de requisición, tipos de contratación, tipos de contrato y opciones de practicante.                          |
| `FormatSectionTitle.tsx`            | Componente encargado de mostrar los encabezados de cada sección del formato mediante bordes, fondo gris y texto en mayúsculas.                                                                                                                          | Se utiliza para separar visualmente información general, motivo, requerimientos, aprobaciones, confirmación y vistos buenos.                     |
| `FormatSignatureBox.tsx`            | Componente encargado de mostrar el espacio de firma dentro del formato imprimible. Presenta la imagen de la firma, el cargo aprobador y la fecha de decisión; cuando no existe una firma, muestra el estado pendiente.                                  | Se utiliza en las aprobaciones de requisición y en los vistos buenos de Talento Humano.                                                          |
| `PersonnelRequisitionWatermark.tsx` | Componente encargado de mostrar el estado general de la requisición como marca de agua dentro del formato. Utiliza un color según el estado y, cuando la requisición fue rechazada o cancelada, incluye también el comentario asociado con la decisión. | Se utiliza dentro de `PersonnelRequisitionFormat.tsx` para identificar visualmente el estado del documento tanto en pantalla como al imprimirlo. |

Estos componentes se ubican en `components/humanTalent/` porque su estructura y comportamiento dependen directamente del flujo de requisiciones de personal y no corresponden a elementos generales del sistema.

---


#### `src/components/positionManagement/`

En esta carpeta se ubican los componentes visuales específicos del módulo de Gestión de Cargos.

Estos componentes administran el historial de revisiones de los perfiles de cargo, los estados de cada revisión, los requisitos fijos y sus descripciones. No pertenecen al módulo de Talento Humano porque su responsabilidad es mantener y versionar la información propia de los cargos.

| Componente                                 | Descripción                                                                                                                                                               | Uso dentro del proyecto                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `PositionProfileRevisionCard.tsx`          | Muestra la información general de una revisión, como número, fecha, estado, observación y acciones disponibles.                                                           | Se utiliza dentro del listado de revisiones de un perfil de cargo.                      |
| `PositionProfileRevisionDetailSection.tsx` | Consulta y presenta el detalle de una revisión, sus requisitos y descripciones. También coordina las acciones de edición, publicación y eliminación de descripciones.     | Se utiliza en la página independiente del detalle de una revisión.                      |
| `PositionProfileRevisionDialog.tsx`        | Diálogo utilizado para crear una nueva revisión en borrador o actualizar la observación de una revisión existente.                                                        | Se abre desde el listado o desde el detalle de revisiones.                              |
| `PositionProfileRevisionsSection.tsx`      | Sección encargada de consultar, listar y gestionar las revisiones de un perfil de cargo. Controla la creación, edición, publicación, eliminación y navegación al detalle. | Se utiliza en `PositionProfileRevisions.tsx` después de seleccionar un perfil de cargo. |
| `PositionRequirementCard.tsx`              | Muestra uno de los requisitos fijos del perfil de cargo y las descripciones registradas dentro de la revisión seleccionada.                                               | Se utiliza dentro del detalle de una revisión.                                          |
| `PositionRequirementDescriptionDialog.tsx` | Diálogo utilizado para registrar o actualizar una descripción asociada con un requisito fijo.                                                                             | Se abre desde cada tarjeta de requisito cuando la revisión está en estado `BORRADOR`.   |

Estos componentes deben importar sus tipos, hooks y servicios desde `positionManagement` y no desde `humanTalent`.

---

#### `src/components/pqrs/`

En esta carpeta se ubican los componentes específicos del módulo de PQR.
Estos componentes están relacionados directamente con la lógica visual de las solicitudes, el chat y la calificación del servicio.

| Componente             | Descripción                                                                                                                                                                                                                                                                                                                                                                            | Uso dentro del proyecto                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PqrChatView.tsx`      | Componente encargado de mostrar la vista visual del chat de una PQR. Presenta la información de la solicitud, los mensajes enviados y recibidos, el campo de escritura, el botón para enviar mensajes, el botón para adjuntar archivos y la visualización de imágenes o documentos enviados en la conversación.                                                                        | Se utiliza en el módulo de PQR para permitir la comunicación entre usuario, agente o administrador mediante mensajes de texto y archivos adjuntos.  |
| `PqrRatingSummary.tsx` | Componente encargado de mostrar el resumen de la calificación realizada por el usuario sobre una PQR. Puede incluir la puntuación, comentario y fecha de calificación.                                                                                                                                                                                                                 | Se utiliza en vistas donde se necesita mostrar la valoración dada a una PQR respondida o cerrada.                                                   |
| `PqrTicketCard.tsx`    | Componente encargado de mostrar una PQR en formato de tarjeta compacta. Presenta el identificador de la PQR, tipo de caso, estado, prioridad, fecha, usuario, agente asignado cuando aplica, descripción, calificación, acciones relacionadas con estado, prioridad y chat. También puede mostrar un contador visual de mensajes sin revisar cuando la PQR tiene novedades en el chat. | Se utiliza en vistas como `AgentPqrs` y `AdminPqrs` para reutilizar el diseño visual de las tarjetas de PQR y evitar repetir código en cada página. |

Estos componentes se ubican en `components/pqrs/` porque dependen directamente del módulo de PQR y no son elementos generales del sistema.

---

#### `src/components/users/`

En esta carpeta se ubican los componentes específicos del módulo de usuarios.
Estos componentes dependen directamente de la información, acciones o reglas relacionadas con los usuarios del sistema.

| Componente                  | Descripción                                                                                                                                                                                                                                                                                                            | Uso dentro del proyecto                                                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChangeUserRoleDialog.tsx`  | Componente que muestra un modal para cambiar el rol de un usuario seleccionado. Permite visualizar información del usuario y seleccionar un nuevo rol.                                                                                                                                                                 | Se utiliza en la administración de usuarios.                                                                                                                                                                  |
| `UserRoleChip.tsx`          | Componente visual que muestra el rol de un usuario mediante una etiqueta o chip con color, texto e ícono.                                                                                                                                                                                                              | Se utiliza en tablas, listados o detalles donde se necesite mostrar el rol de un usuario.                                                                                                                     |
| `UserSignatureUploader.tsx` | Componente encargado de registrar o actualizar la firma del usuario autenticado. Permite seleccionar una imagen, validar el archivo, mostrar una vista previa y enviarlo al backend mediante `multipart/form-data`. La firma guardada se utiliza posteriormente en aprobaciones, vistos buenos y formatos imprimibles. | Puede abrirse desde el menú de configuración del usuario y se utiliza para garantizar que el usuario tenga una firma registrada antes de aprobar, rechazar o cancelar pasos dentro de los flujos del sistema. |

Estos componentes no se ubican en `components/common/` porque su uso está relacionado directamente con el módulo de usuarios.

---

#### Regla de organización de componentes

```txt
Si el componente puede usarse en varias vistas, debe ir en components/common.
Si el componente solo pertenece a un módulo específico, debe ir en components/nombreModulo.
Si el componente define la estructura visual general de una página, debe ir en components/layouts.
```

Esta organización permite que el proyecto sea más limpio, escalable y fácil de mantener, ya que cada componente tiene una responsabilidad clara y una ubicación lógica dentro de la estructura del frontend.

---

### `src/context/`

Esta carpeta contiene los contextos globales de React.

Se utiliza para manejar información que debe estar disponible en varias partes de la aplicación, como la autenticación del usuario, el token, la sesión activa y el cierre de sesión.

**Ejemplo:**

```txt
context/
└── AuthContext.tsx
```

| Archivo           | Descripción                                                                                                                                                                        | Uso dentro del proyecto                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthContext.tsx` | Contexto encargado de manejar el usuario autenticado, el token, el inicio de sesión, el cierre de sesión y la conexión global con Socket.IO cuando el usuario ya está autenticado. | Se utiliza para permitir que componentes, hooks y páginas accedan al usuario actual, validen si existe sesión activa y desconecten el socket al cerrar sesión. |

---

#### Responsabilidad principal

```txt
Manejar el estado global de autenticación.
Guardar y eliminar el token del localStorage.
Consultar el perfil del usuario autenticado.
Conectar Socket.IO cuando existe token y usuario.
Desconectar Socket.IO cuando el usuario cierra sesión.
```

---

#### Funcionamiento general de `AuthContext.tsx`

El contexto de autenticación administra la sesión del usuario dentro del frontend.

Cuando el usuario inicia sesión, el token se guarda en el `localStorage` y también en el estado global del contexto. Luego, el sistema consulta el perfil del usuario autenticado mediante el endpoint correspondiente.

Si el perfil se obtiene correctamente, se guarda la información del usuario en el estado global. Cuando ya existe un token válido y un usuario cargado, el sistema conecta Socket.IO para habilitar funcionalidades en tiempo real, como el chat de PQR y las notificaciones internas.

Cuando el usuario cierra sesión, se desconecta Socket.IO, se elimina el token del `localStorage` y se limpia la información del usuario autenticado.

---

### `src/data/`

Esta carpeta contiene datos estáticos o listas reutilizables dentro del frontend.

Los archivos ubicados en `data/` no manejan lógica compleja ni realizan peticiones al backend. Su función principal es centralizar información fija que se usa en diferentes partes del sistema, evitando escribir los mismos datos repetidamente dentro de los componentes.

Ejemplos:

```txt
data/
├── appBrand.ts
├── humanTalentOptions.ts
├── menuItems.ts
├── pqrOptions.ts
└── userRoles.ts
```

**Aquí pueden ir datos como:**

```txt
Información de la marca
Roles disponibles
Opciones de menú
Estados de una PQR
Tipos de solicitudes
Textos o configuraciones fijas del sistema
```

**Responsabilidad principal:**

```txt
Centralizar datos fijos para evitar escribirlos repetidamente en los componentes.
```

---

#### `appBrand.ts`

El archivo `appBrand.ts` contiene la información visual fija de la marca del sistema.

Su objetivo principal es centralizar los datos relacionados con el nombre de la aplicación, el logo principal, el ícono del logo y los textos alternativos de las imágenes.

| Propiedad       | Descripción                                             | Uso dentro del proyecto                                                                                              |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `name`          | Contiene el nombre oficial de la aplicación o empresa.  | Se puede utilizar en títulos, encabezados, menús o pantallas principales.                                            |
| `logo`          | Contiene la ruta del logo principal de INCOBRA a color. | Se utiliza para mostrar el logo completo en pantallas claras como login, header o sidebar.                           |
| `logoWhite`     | Contiene la ruta del logo principal en color blanco.    | Se utiliza cuando el logo debe mostrarse sobre fondos oscuros o fondos institucionales.                              |
| `logoIcon`      | Contiene la ruta del ícono del logo a color.            | Se utiliza cuando se necesita una versión más pequeña del logo, por ejemplo en menús contraídos o vistas responsive. |
| `logoIconWhite` | Contiene la ruta del ícono del logo en color blanco.    | Se utiliza en fondos oscuros, barras laterales o encabezados institucionales.                                        |
| `logoAlt`       | Contiene el texto alternativo de la imagen.             | Mejora la accesibilidad y sirve como descripción si la imagen no carga.                                              |

---

#### `humanTalentOptions.ts`

El archivo `humanTalentOptions.ts` contiene las opciones estáticas utilizadas en el módulo de Talento Humano.

| Constante                   | Descripción                                                                     | Uso dentro del proyecto                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `requisitionReasonOptions`  | Contiene los motivos permitidos para crear una requisición de personal.         | Se utiliza en el formulario de creación de requisición para seleccionar el motivo de la solicitud.            |
| `contractTypeOptions`       | Contiene los tipos principales de contratación disponibles.                     | Se utiliza para seleccionar si la contratación será directa, temporal o practicante.                          |
| `directContractTypeOptions` | Contiene las opciones permitidas cuando el tipo de contratación es directa.     | Se utiliza para seleccionar si el contrato directo será indefinido o fijo.                                    |
| `internContractTypeOptions` | Contiene las opciones permitidas cuando el tipo de contratación es practicante. | Se utiliza para seleccionar si el practicante será aprendiz, pasante o rotante.                               |
| `requisitionStatusOptions`  | Contiene los estados disponibles para una requisición de personal.              | Se utilizará en listados, filtros o vistas donde se necesite mostrar o consultar el estado de la requisición. |
| `candidateApplicationConceptOptions` | Contiene las opciones `Ingreso` y `Modificación de cargo` utilizadas en el concepto de aplicación. | Se utiliza en la Fase 1 de la validación de cargo y postulante. |
| `candidatePositionTypeOptions` | Contiene las opciones `Nuevo cargo` y `Cargo existente`. | Se utiliza en la Fase 2 de la validación para clasificar el cargo del proceso. |

---

#### `menuItems.ts`

Este archivo contiene las opciones principales del menú del sistema.

Puede incluir información como el nombre de la opción, la ruta a la que debe navegar, el ícono que se va a mostrar y los roles que tienen permiso para verla.

**Responsabilidad principal:**

```txt
Centralizar las opciones de navegación del sistema.
```

---

#### `pqrOptions.ts`

El archivo `pqrOptions.ts` contiene las opciones estáticas utilizadas en el módulo de PQR.

Su objetivo principal es centralizar las listas que se usan en formularios, filtros y controles de selección relacionados con las solicitudes PQR. De esta manera, los tipos de caso, estados y prioridades no se escriben repetidamente dentro de los componentes o páginas.

| Constante            | Descripción                                                               | Uso dentro del proyecto                                                                                        |
| -------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pqrCaseTypes`       | Contiene los tipos de caso disponibles al momento de crear una nueva PQR. | Se utiliza en formularios donde el usuario selecciona el tipo de solicitud que desea crear.                    |
| `pqrStatusOptions`   | Contiene los estados disponibles para una PQR.                            | Se utiliza en filtros, selectores o acciones administrativas para consultar o cambiar el estado de una PQR.    |
| `pqrPriorityOptions` | Contiene las prioridades disponibles para una PQR.                        | Se utiliza en filtros o selectores donde el administrador o agente define la prioridad de atención de una PQR. |

---

#### `userRoles.ts`

El archivo `userRoles.ts` contiene la lista de roles disponibles dentro del sistema.

Su objetivo principal es centralizar los roles que pueden asignarse a los usuarios, evitando escribirlos manualmente en diferentes componentes, formularios o filtros.

Este archivo importa el tipo `UserRole` desde la interfaz de usuario para asegurar que los roles definidos correspondan con los valores permitidos por el sistema.

| Constante   | Descripción                                         | Uso dentro del proyecto                                                                                    |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `userRoles` | Contiene la lista de roles disponibles del sistema. | Se utiliza en formularios, filtros y componentes donde se necesita seleccionar o mostrar roles de usuario. |

---

### `src/hooks/`

Los hooks permiten separar la lógica de una página o componente, dejando los componentes visuales más limpios, organizados y fáciles de mantener.

En lugar de manejar toda la lógica directamente dentro de las páginas, los hooks se encargan de procesos como consultar datos, enviar formularios, manejar estados de carga, controlar errores, escuchar eventos en tiempo real y ejecutar acciones relacionadas con cada módulo.

---

#### Estructura

```txt
hooks/
│
├── auth/
│   ├── useLogin.ts
│   └── useRegister.ts
│
├── humanTalent/
│   ├── candidateValidation/
│   │   ├── usePersonnelCandidateValidationDetail.ts
│   │   └── usePersonnelCandidateValidations.ts
│   │
│   └── requisitions/
│       ├── useCreatePersonnelRequisition.ts
│       ├── usePersonnelRequisitionCandidates.ts
│       ├── usePersonnelRequisitionDetail.ts
│       └── usePersonnelRequisitions.ts
│
├── positionManagement/
│   ├── usePositionProfileRevisionSelector.ts
│   └── usePositionProfileRevisions.ts
│
├── notifications/
│   └── useNotifications.ts
│
├── pqrs/
│   ├── useAdminPqrs.ts
│   ├── useAgentPqrs.ts
│   ├── useCreatePqr.ts
│   ├── useMyPqrs.ts
│   └── usePqrChat.ts
│
└── users/
    ├── useAdminUsers.ts
    └── useUserSignature.ts
```

---

#### Responsabilidad principal

```txt
Separar la lógica de negocio, estado y eventos de los componentes visuales.
```

Los hooks permiten que las páginas y componentes se enfoquen principalmente en mostrar la interfaz, mientras que la lógica de consulta, validación, envío de datos y manejo de respuestas queda centralizada en archivos reutilizables.

---

#### Hooks del módulo de autenticación

```txt
hooks/auth/
├── useLogin.ts
└── useRegister.ts
```

| Hook             | Descripción                                                                                                                                                                                                                | Uso dentro del proyecto                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `useLogin.ts`    | Maneja la lógica del inicio de sesión. Controla los valores del formulario, validaciones, mensajes de error, estado de carga, almacenamiento de la sesión y redirección del usuario después de autenticarse correctamente. | Se utiliza en la página `Login.tsx`.    |
| `useRegister.ts` | Maneja la lógica del registro de usuarios. Controla los campos del formulario, validaciones, mensajes de éxito o error, estado de carga y redirección al inicio de sesión después de completar el registro.                | Se utiliza en la página `Register.tsx`. |

---

#### Hooks del módulo de Talento Humano

Los hooks de Talento Humano se separan entre `candidateValidation/` y `requisitions/` para mantener aislada la lógica de cada proceso.


```txt
hooks/humanTalent/
├── candidateValidation/
│   ├── usePersonnelCandidateValidationDetail.ts
│   └── usePersonnelCandidateValidations.ts
│
└── requisitions/
    ├── useCreatePersonnelRequisition.ts
    ├── usePersonnelRequisitionCandidates.ts
    ├── usePersonnelRequisitionDetail.ts
    └── usePersonnelRequisitions.ts
```

| Hook                                   | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Uso dentro del proyecto                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useCreatePersonnelRequisition.ts`     | Maneja la lógica del formulario para crear una requisición de personal. Controla los estados del formulario, carga departamentos, perfiles de cargo y ciudades, consulta automáticamente la revisión vigente del cargo seleccionado, valida la información con Yup, limpia errores, muestra mensajes de respuesta y envía la requisición al backend junto con el identificador de la revisión utilizada. También controla campos condicionales relacionados con el motivo y el tipo de contratación.                                                                      | Se utiliza en la página `CreatePersonnelRequisition.tsx`.                                                                                                                |
| `usePersonnelCandidateValidations.ts`  | Maneja la consulta del listado de candidatos disponibles para el módulo de validación, los permisos generales de gestión, estados de carga, errores y mensajes del listado. | Se utiliza en `PersonnelCandidateValidations.tsx`. |
| `usePersonnelCandidateValidationDetail.ts` | Maneja la lógica completa del detalle y de las tres fases de validación. Inicializa los formularios y errores según la revisión exacta de la requisición, valida con Yup, guarda cada fase, vuelve a consultar el detalle después de cada guardado y administra mensajes y estados de carga. | Se utiliza en `PersonnelCandidateValidationSection.tsx`. |
| `usePersonnelRequisitionCandidates.ts` | Maneja la lógica completa del cargue de candidatos. Consulta candidatos, tipos de identificación y el historial de movimientos; controla formularios, archivos, eliminación, cierre y reapertura. Recibe `candidateSubmissionDeadlineAt` y `candidateSubmissionClosedAt` para detectar si corresponde un primer cierre tardío. En ese caso exige `lateReason`; para cada reapertura exige `reason`. Después de cerrar o reabrir vuelve a consultar el historial. Expone callbacks `onSubmissionClosed` y `onSubmissionReopened` para sincronizar el estado visual sin recargar la página. | Se utiliza en `PersonnelRequisitionCandidatesSection.tsx`. |
| `usePersonnelRequisitionDetail.ts`     | Maneja la consulta del detalle completo de una requisición de personal mediante su identificador. Controla el estado de carga, almacena la requisición obtenida, procesa errores de la petición y permite volver a cargar la información cuando sea necesario.                                                                                                                                                                                                                                                                                                            | Se utiliza en `PersonnelRequisitionDetail.tsx` y `PersonnelRequisitionFormat.tsx` para consultar la misma información desde la vista de detalle y el formato imprimible. |
| `usePersonnelRequisitions.ts`          | Maneja la lógica principal del listado y flujo de requisiciones de personal. Consulta las requisiciones disponibles, controla estados de carga, selecciona la requisición sobre la que se realizará una acción y coordina las decisiones de aprobación o rechazo. También maneja la creación de la confirmación de contratación, las decisiones de Talento Humano, la apertura y cierre de diálogos y los mensajes mostrados mediante snackbar.                                                                                                                           | Se utiliza en la página `PersonnelRequisitions.tsx` para listar y gestionar las requisiciones según los permisos y el paso actual del usuario dentro del flujo.          |

---

Este hook centraliza el comportamiento de la página principal del módulo de requisiciones.

**Puede controlar información como:**

```txt
Listado de requisiciones.
Carga inicial de información.
Requisición seleccionada.
Estados de aprobación o rechazo.
Confirmación final de contratación.
Apertura de diálogos.
Mensajes de éxito, error, información o advertencia.
Actualización del listado después de una decisión.
```

La página `PersonnelRequisitions.tsx` no debe ejecutar directamente las peticiones del servicio. Debe utilizar las funciones expuestas por este hook para aprobar, rechazar, confirmar o actualizar una requisición.

---


#### Hooks del módulo de Gestión de Cargos

```txt
hooks/positionManagement/
├── usePositionProfileRevisionSelector.ts
└── usePositionProfileRevisions.ts
```

| Hook                                    | Descripción                                                                                                                                                                                                                                                                                  | Uso dentro del proyecto                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `usePositionProfileRevisionSelector.ts` | Maneja la selección del departamento y del perfil de cargo. Carga los departamentos disponibles, consulta los perfiles asociados con el departamento seleccionado y permite recuperar la selección almacenada en los parámetros de la URL.                                                   | Se utiliza en `PositionProfileRevisions.tsx`.                                                     |
| `usePositionProfileRevisions.ts`        | Maneja la lógica completa de las revisiones de perfiles de cargo. Consulta el listado y el detalle, administra formularios, validaciones, diálogos, estados de carga y mensajes, y ejecuta las operaciones de crear, actualizar, eliminar, publicar y gestionar descripciones de requisitos. | Se utiliza en `PositionProfileRevisionsSection.tsx` y `PositionProfileRevisionDetailSection.tsx`. |

La lógica de revisiones debe permanecer en `hooks/positionManagement/` y no en `hooks/humanTalent/`.

---

#### Hooks del módulo de notificaciones

```txt
hooks/notifications/
└── useNotifications.ts
```

| Hook                  | Descripción                                                                                                                                                                                                                         | Uso dentro del proyecto               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `useNotifications.ts` | Maneja la lógica de las notificaciones del usuario autenticado. Consulta el listado de notificaciones, obtiene el contador de no leídas, permite marcar una o todas como leídas y escucha nuevas notificaciones mediante Socket.IO. | Se utiliza en `NotificationBell.tsx`. |

Este hook permite mantener sincronizado el contador de notificaciones sin recargar completamente la aplicación.

---

#### Hooks del módulo de PQR

```txt
hooks/pqrs/
├── useAdminPqrs.ts
├── useAgentPqrs.ts
├── useCreatePqr.ts
├── useMyPqrs.ts
└── usePqrChat.ts
```

| Hook              | Descripción                                                                                                                                                                                           | Uso dentro del proyecto                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `useAdminPqrs.ts` | Maneja la lógica relacionada con la administración de PQR. Controla la consulta de solicitudes, cambio de estados, modificación de prioridad, asignación de agentes y demás acciones administrativas. | Se utiliza en el módulo administrativo de PQR.            |
| `useAgentPqrs.ts` | Maneja las PQR disponibles y asignadas a los agentes. Permite consultar solicitudes, tomar casos, gestionar la atención y actualizar en tiempo real el contador de mensajes sin revisar.              | Se utiliza en las páginas correspondientes al rol agente. |
| `useCreatePqr.ts` | Maneja la lógica del formulario para crear una PQR. Controla los campos, archivo adjunto, validaciones, estado de carga, mensajes de éxito o error y envío de la solicitud al backend.                | Se utiliza en la página `CreatePqr.tsx`.                  |
| `useMyPqrs.ts`    | Maneja la consulta y presentación de las PQR creadas por el usuario autenticado. Controla estados, detalles, chat, calificación del servicio y contador de mensajes sin revisar.                      | Se utiliza en la página `MyPqrs.tsx`.                     |
| `usePqrChat.ts`   | Maneja la lógica del chat de una PQR. Consulta mensajes, envía textos y archivos adjuntos, escucha nuevos mensajes mediante Socket.IO y marca la conversación como leída cuando el usuario la abre.   | Se utiliza en `PqrChatView.tsx`.                          |

---

#### Hooks del módulo de usuarios

```txt
hooks/users/
├── useAdminUsers.ts
└── useUserSignature.ts
```

| Hook                  | Descripción                                                                                                                                                                                                                                                  | Uso dentro del proyecto                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useAdminUsers.ts`    | Maneja la lógica relacionada con la administración de usuarios. Controla la consulta de usuarios, cambio de roles, selección de archivos para carga masiva, procesamiento de resultados y mensajes de respuesta.                                             | Se utiliza en la página de administración de usuarios.                                                                                               |
| `useUserSignature.ts` | Maneja la lógica relacionada con el registro o actualización de la firma del usuario autenticado. Controla la selección del archivo, validación de formato, vista previa, estado de carga, envío mediante `multipart/form-data` y mensajes de éxito o error. | Se utiliza en `UserSignatureUploader.tsx` para permitir que el usuario configure la firma que será utilizada en aprobaciones y formatos del sistema. |

---

### `src/interfaces/`

Esta carpeta contiene las interfaces y tipos de TypeScript que definen la estructura de los datos utilizados en el proyecto.

Aquí se declaran los tipos que representan entidades como usuarios, roles, autenticación, PQR, mensajes, archivos adjuntos, notificaciones, respuestas del backend, carga masiva y datos enviados desde formularios.

Las interfaces permiten que el frontend tenga un tipado más seguro, claro y fácil de mantener, evitando repetir estructuras de datos en diferentes archivos.

---

#### Estructura

```txt
interfaces/
│
├── auth/
│   └── auth.interface.ts
│
├── common/
│   ├── city.interface.ts
│   ├── identificationType.interface.ts
│   └── message.interface.ts
│
├── humanTalent/
│   ├── candidateValidation/
│   │   └── personnelCandidateValidation.interface.ts
│   │
│   └── requisitions/
│       └── personnelRequisition.interface.ts
│
├── positionManagement/
│   ├── positionProfile.interface.ts
│   └── positionProfileRevision.interface.ts
│
├── notifications/
│   └── notification.interface.ts
│
├── pqrs/
│   └── pqr.interface.ts
│
└── users/
    ├── user.interface.ts
    ├── bulkUpload.interface.ts
    └── excel.interface.ts
```

---

#### Interfaces del módulo de autenticación

```txt
interfaces/auth/
└── auth.interface.ts
```

| Archivo             | Descripción                                                                                                                          | Uso dentro del proyecto                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `auth.interface.ts` | Define los tipos relacionados con autenticación, inicio de sesión, registro, respuestas del backend y datos del usuario autenticado. | Se utiliza en servicios, hooks, contexto y páginas relacionadas con login, registro y sesión. |

---

#### Interfaces comunes

```txt
interfaces/common/
├── city.interface.ts
├── identificationType.interface.ts
└── message.interface.ts
```

| Archivo                           | Descripción                                                                                                    | Uso dentro del proyecto                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `city.interface.ts`               | Define los tipos relacionados con las ciudades activas del sistema y la respuesta del backend al consultarlas. | Se utiliza en servicios y formularios que necesitan cargar ciudades, como Talento Humano u otros módulos futuros. |
| `identificationType.interface.ts` | Define `IdentificationType` y la respuesta utilizada para consultar los tipos de identificación activos.       | Se utiliza en formularios y módulos que requieran seleccionar o mostrar un tipo de identificación.                |
| `message.interface.ts`            | Define el tipo común `MessageType`, usado para mensajes visuales como alertas o snackbar.                      | Se utiliza en diferentes módulos para evitar repetir tipos como `success`, `error`, `info` y `warning`.           |

---

#### Interfaces del módulo de Talento Humano

Las interfaces se organizan por proceso: `candidateValidation/` para la validación de postulantes y `requisitions/` para requisiciones, contratación y cargue de candidatos.


```txt
interfaces/humanTalent/
├── candidateValidation/
│   └── personnelCandidateValidation.interface.ts
│
└── requisitions/
    └── personnelRequisition.interface.ts
```

| Archivo                             | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Uso dentro del proyecto                                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `personnelCandidateValidation.interface.ts` | Define los tipos e interfaces del proceso de validación de cargo y postulante. Incluye conceptos de aplicación, tipo de cargo, estados del proceso, detalle del candidato, revisión de perfil, descripciones de requisitos, formularios de las tres fases, errores de validación y payloads enviados al backend. | Se utiliza en servicios, hooks y componentes del módulo de validación de candidatos. |
| `personnelRequisition.interface.ts` | Define los tipos e interfaces relacionados con el flujo completo de requisiciones de personal. | Se utiliza en servicios, hooks, componentes y páginas relacionadas con la creación, consulta, aprobación, confirmación, cargue y trazabilidad de candidatos. |

---


#### Interfaces del módulo de Gestión de Cargos

```txt
interfaces/positionManagement/
├── positionProfile.interface.ts
└── positionProfileRevision.interface.ts
```

| Archivo                                | Descripción                                                                                                                                                                                                                                                                                             | Uso dentro del proyecto                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `positionProfile.interface.ts`         | Define los tipos básicos de perfiles de cargo y las respuestas utilizadas para consultar los perfiles activos asociados con un departamento.                                                                                                                                                            | Se utiliza en servicios, hooks y selectores del módulo de Gestión de Cargos, y puede ser importado por Talento Humano.                                             |
| `positionProfileRevision.interface.ts` | Define los estados de revisión, datos generales, detalle, requisitos, descripciones, formularios, errores de validación y respuestas del backend relacionadas con revisiones de perfiles de cargo. También incluye la respuesta utilizada para consultar la revisión vigente de un perfil seleccionado. | Se utiliza en servicios, hooks, componentes y páginas de `positionManagement`, y en el formulario de creación de requisiciones para consultar la revisión vigente. |

---

#### Interfaces del módulo de notificaciones

```txt
interfaces/notifications/
└── notification.interface.ts
```

| Archivo                     | Descripción                                                                             | Uso dentro del proyecto                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `notification.interface.ts` | Define los tipos e interfaces relacionados con las notificaciones internas del sistema. | Se utiliza en `notificationService.ts`, `useNotifications.ts`, `NotificationBell.tsx` y eventos de Socket.IO. |

---

#### Interfaces del módulo de PQR

```txt
interfaces/pqrs/
└── pqr.interface.ts
```

| Archivo            | Descripción                                                                                                                                                        | Uso dentro del proyecto                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pqr.interface.ts` | Define los tipos relacionados con PQR, mensajes del chat, archivos adjuntos, estados, prioridades, tipos de caso, calificación y contador de mensajes sin revisar. | Se utiliza en servicios, hooks, componentes y páginas del módulo PQR para tipar solicitudes, mensajes, adjuntos, respuestas del backend y eventos relacionados. |

---

#### Interfaces del módulo de usuarios

```txt
interfaces/users/
├── user.interface.ts
├── bulkUpload.interface.ts
└── excel.interface.ts
```

| Archivo                   | Descripción                                                                                                                          | Uso dentro del proyecto                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `user.interface.ts`       | Define los tipos relacionados con usuarios, roles, agentes, administradores y datos de perfil.                                       | Se utiliza en administración de usuarios, servicios, hooks, componentes relacionados con roles y contexto de autenticación. |
| `bulkUpload.interface.ts` | Define los tipos relacionados con carga masiva de usuarios, archivos seleccionados, resultados del proceso y errores de importación. | Se utiliza en componentes, hooks y servicios relacionados con la carga masiva de usuarios.                                  |
| `excel.interface.ts`      | Define los tipos relacionados con la estructura y manejo de archivos Excel dentro del frontend.                                      | Se utiliza en funciones o plantillas encargadas de generar, leer o preparar archivos de Excel.                              |

---

### `src/pages/`

Esta carpeta contiene las páginas principales de la aplicación.

Cada archivo representa una vista completa asociada con una ruta del sistema. Las páginas se encargan de organizar componentes, utilizar hooks y presentar la información al usuario.

Las páginas no deben realizar directamente peticiones HTTP ni concentrar lógica extensa. La comunicación con el backend debe mantenerse en los servicios y la lógica de estado, validación y acciones debe separarse mediante hooks.

---

#### Estructura

```txt
pages/
│
├── Dashboard.tsx
├── Login.tsx
├── Register.tsx
│
├── humanTalent/
│   ├── candidateValidation/
│   │   ├── PersonnelCandidateValidationDetail.tsx
│   │   └── PersonnelCandidateValidations.tsx
│   │
│   └── requisitions/
│       ├── CreatePersonnelRequisition.tsx
│       ├── PersonnelRequisitionDetail.tsx
│       ├── PersonnelRequisitionFormat.tsx
│       └── PersonnelRequisitions.tsx
│
├── positionManagement/
│   ├── PositionProfileRevisionDetail.tsx
│   └── PositionProfileRevisions.tsx
│
├── PQR/
│   ├── admin/
│   │   ├── AdminPqrs.tsx
│   │   └── AdminUser.tsx
│   ├── agent/
│   │   └── AgentPqrs.tsx
│   └── user/
│       ├── CreatePqr.tsx
│       └── MyPqrs.tsx
│
└── users/
    └── UserSignature.tsx
```

---

#### Responsabilidad principal

```txt
Construir las vistas completas del sistema utilizando componentes, hooks y datos obtenidos mediante los servicios.
```

**Las páginas deben enfocarse principalmente en:**

```txt
Organizar la estructura visual.
Utilizar componentes reutilizables.
Consumir la información expuesta por los hooks.
Manejar navegación entre rutas.
Mostrar estados de carga, errores y resultados vacíos.
```

---

#### Páginas generales

```txt
pages/
├── Dashboard.tsx
├── Login.tsx
└── Register.tsx
```

| Página          | Descripción                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dashboard.tsx` | Representa la página principal de las vistas protegidas. Puede mostrar información general, accesos rápidos, indicadores o contenido relacionado con los módulos disponibles para el usuario. |
| `Login.tsx`     | Muestra el formulario de inicio de sesión y utiliza `useLogin.ts` para manejar los datos, validaciones, carga, errores y autenticación del usuario.                                           |
| `Register.tsx`  | Muestra el formulario de registro y utiliza `useRegister.ts` para manejar los campos, validaciones, envío de información y mensajes de respuesta.                                             |

---

#### Páginas del módulo de Talento Humano

Las páginas se dividen entre `candidateValidation/` y `requisitions/`, de acuerdo con el proceso que representan.


```txt
pages/humanTalent/
├── candidateValidation/
│   ├── PersonnelCandidateValidationDetail.tsx
│   └── PersonnelCandidateValidations.tsx
│
└── requisitions/
    ├── CreatePersonnelRequisition.tsx
    ├── PersonnelRequisitionDetail.tsx
    ├── PersonnelRequisitionFormat.tsx
    └── PersonnelRequisitions.tsx
```

| Página                           | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CreatePersonnelRequisition.tsx` | Muestra el formulario para crear una requisición de personal. Utiliza `useCreatePersonnelRequisition.ts` para cargar departamentos, perfiles de cargo y ciudades, consultar y mostrar automáticamente la revisión vigente del cargo seleccionado, controlar los valores, validar la información y enviar la solicitud al backend.                                                                                                                                                                                                                    |
| `PersonnelCandidateValidations.tsx` | Muestra el listado de candidatos disponibles para el proceso de validación de cargo y postulante. Permite buscar candidatos y navegar al detalle individual de validación. |
| `PersonnelCandidateValidationDetail.tsx` | Muestra la vista independiente del proceso de validación de un candidato. Obtiene `candidateId` desde la ruta, presenta el encabezado de página y delega el flujo de etapas a `PersonnelCandidateValidationSection.tsx`. |
| `PersonnelRequisitions.tsx`      | Muestra el listado general de requisiciones de personal y las acciones disponibles según el usuario y el paso actual del flujo. Utiliza `usePersonnelRequisitions.ts` para consultar, aprobar, rechazar, cancelar y registrar o decidir la confirmación de contratación.                                                                                                                                                                                                                                                                             |
| `PersonnelRequisitionDetail.tsx` | Página encargada de presentar el detalle completo de una requisición de personal. Organiza la información general, condiciones de contratación, aprobaciones, confirmación de contratación y vistos buenos de Talento Humano. Cuando el proceso de presentación de candidatos ha sido iniciado, integra `PersonnelRequisitionCandidatesSection.tsx`, desde donde se consulta y gestiona el cargue de candidatos según el estado del proceso y los permisos del usuario. |
| `PersonnelRequisitionFormat.tsx` | Construye la vista independiente utilizada para visualizar e imprimir el formato de requisición. Presenta la información general, el código y la revisión del perfil de cargo utilizada, opciones seleccionadas, firmas, fechas y estado general mediante una marca de agua. Reutiliza `usePersonnelRequisitionDetail.ts` y los componentes ubicados en `components/humanTalent/requisitionFormat/`.                                                                                                                                                 |

---

#### Páginas del módulo de Gestión de Cargos

```txt
pages/positionManagement/
├── PositionProfileRevisionDetail.tsx
└── PositionProfileRevisions.tsx
```

| Página                              | Descripción                                                                                                                                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PositionProfileRevisions.tsx`      | Muestra los selectores de departamento y perfil de cargo, conserva la selección mediante parámetros de la URL y renderiza el historial de revisiones del perfil seleccionado.                                                                            |
| `PositionProfileRevisionDetail.tsx` | Muestra la vista independiente del detalle de una revisión. Obtiene los identificadores desde la ruta, permite regresar al historial conservando la selección anterior y utiliza `PositionProfileRevisionDetailSection.tsx` para gestionar el contenido. |

---

#### Páginas del módulo de PQR

```txt
pages/pqrs/
├── admin/
│   ├── AdminPqrs.tsx
│   └── AdminUser.tsx
├── agent/
│   └── AgentPqrs.tsx
└── user/
    ├── CreatePqr.tsx
    └── MyPqrs.tsx
```

Las páginas del módulo de PQR se organizan según el tipo de usuario y las acciones que puede realizar.

---

##### Páginas administrativas

| Página          | Descripción                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdminPqrs.tsx` | Muestra las PQR disponibles para administración. Permite consultar solicitudes, modificar estados y prioridades, asignar agentes y ejecutar acciones administrativas. |
| `AdminUser.tsx` | Muestra la administración de usuarios. Permite consultar usuarios, modificar roles y realizar procesos de carga masiva.                                               |

---

##### Páginas del agente

| Página          | Descripción                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `AgentPqrs.tsx` | Muestra las PQR disponibles y asignadas al agente autenticado. Permite tomar solicitudes, gestionar casos y consultar novedades del chat. |

---

##### Páginas del usuario

| Página          | Descripción                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CreatePqr.tsx` | Muestra el formulario para registrar una nueva PQR, incluyendo tipo de caso, descripción y archivo adjunto cuando corresponde.                              |
| `MyPqrs.tsx`    | Muestra las PQR creadas por el usuario autenticado. Permite consultar detalles, acceder al chat y realizar la calificación del servicio cuando corresponde. |

---

#### Páginas del módulo de usuarios

```txt
pages/users/
└── UserSignature.tsx
```

| Página              | Descripción                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UserSignature.tsx` | Muestra la página de configuración de firma del usuario autenticado. Utiliza `UserSignatureUploader.tsx` y `useUserSignature.ts` para seleccionar, validar, previsualizar y cargar la imagen que será utilizada en aprobaciones y formatos del sistema. |

La página se ubica en `pages/users/` porque la firma pertenece a la configuración del usuario y puede ser utilizada por diferentes módulos, no solamente por Talento Humano.

---

#### Regla de organización de páginas

```txt
Las páginas generales se ubican directamente en pages.
Las páginas específicas de un módulo deben ubicarse en pages/nombreModulo.
Las páginas organizadas por rol pueden dividirse en subcarpetas como admin, agent o user.
Las páginas deben consumir hooks y componentes, evitando realizar directamente peticiones HTTP.
La lógica reutilizable no debe permanecer dentro de las páginas.
```

Esta organización permite que cada ruta tenga una vista claramente identificada y evita mezclar páginas pertenecientes a diferentes módulos o responsabilidades.

---

### `src/routes/`

Esta carpeta contiene la configuración de rutas del proyecto.

Aquí se definen las rutas públicas, privadas y las páginas que se muestran según la URL.

**Ejemplo:**

```txt
routes/
├── AppRoutes.tsx
└── PrivateRoute.tsx
```

**Responsabilidad principal:**

```txt
Centralizar la navegación del sistema.
```

---

### `src/services/`

Esta carpeta contiene las funciones encargadas de comunicarse con el backend.

Aquí se centralizan las peticiones HTTP realizadas con Axios y la comunicación en tiempo real mediante Socket.IO. Su objetivo principal es evitar que los componentes, páginas o hooks llamen directamente a la API o configuren manualmente la conexión con sockets.

Los servicios permiten mantener separada la lógica de comunicación con el backend, dejando que las páginas y componentes se enfoquen en mostrar la información y manejar la interacción del usuario.

---

#### Estructura

```txt
services/
│
├── auth/
│   └── authService.ts
│
├── common/
│   ├── cityService.ts
│   └── identificationTypeService.ts
│
├── humanTalent/
│   ├── candidateValidation/
│   │   └── personnelCandidateValidationService.ts
│   │
│   └── requisitions/
│       └── personnelRequisitionService.ts
│
├── positionManagement/
│   ├── positionProfileRevisionService.ts
│   └── positionProfileService.ts
│
├── notifications/
│   └── notificationService.ts
│
├── pqrs/
│   └── pqrService.ts
│
├── sockets/
│   └── socketService.ts
│
└── users/
    └── userService.ts
```

---

#### Responsabilidad principal de `services/`

```txt
Separar las peticiones HTTP y la comunicación en tiempo real de los componentes visuales.
```

Los componentes no deberían llamar directamente a Axios ni configurar directamente Socket.IO.

Lo ideal es que usen funciones centralizadas en los servicios. Esto permite que páginas, hooks y componentes se enfoquen en mostrar información y manejar la interacción del usuario, mientras que los servicios se encargan de la comunicación con el backend.

---

#### Servicios del módulo de autenticación

```txt
services/auth/
└── authService.ts
```

| Archivo          | Descripción                                                                                 | Uso dentro del proyecto                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `authService.ts` | Contiene las funciones HTTP relacionadas con el inicio de sesión y el registro de usuarios. | Se utiliza desde los hooks de autenticación para enviar las credenciales y datos de registro al backend. |

---

##### Funciones en `authService.ts`

```txt
loginUser()
registerUser()
```

| Función              | Descripción                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| `loginUser(data)`    | Envía el correo y la contraseña al backend para iniciar sesión.               |
| `registerUser(data)` | Envía la información necesaria para registrar un nuevo usuario en el sistema. |

---

#### Servicios comunes

```txt
services/common/
├── cityService.ts
└── identificationTypeService.ts
```

| Archivo                        | Descripción                                                                                                    | Uso dentro del proyecto                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `cityService.ts`               | Contiene la función HTTP encargada de consultar las ciudades activas disponibles en el sistema.                | Se utiliza desde formularios y hooks que necesitan cargar ciudades, como el formulario de creación de requisiciones de personal. |
| `identificationTypeService.ts` | Contiene la función HTTP encargada de consultar los tipos de identificación activos disponibles en el sistema. | Se utiliza en formularios que requieren seleccionar el tipo de identificación, como el registro y edición de candidatos.         |

---

##### Funciones en servicios comunes

```txt
getCities()
getIdentificationTypes()
```

| Función                    | Descripción                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `getCities()`              | Consulta las ciudades activas disponibles mediante el endpoint común de ciudades.     |
| `getIdentificationTypes()` | Consulta los tipos de identificación activos mediante `/common/identification-types`. |

---

#### Servicios del módulo de Talento Humano

Los servicios se separan entre `candidateValidation/` y `requisitions/` para mantener agrupadas las peticiones HTTP de cada proceso.


```txt
services/humanTalent/
├── candidateValidation/
│   └── personnelCandidateValidationService.ts
│
└── requisitions/
    └── personnelRequisitionService.ts
```

| Archivo                          | Descripción                                                                                                                                                                                                                                                                                                                                                              | Uso dentro del proyecto                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `personnelCandidateValidationService.ts` | Contiene las funciones HTTP del proceso de validación de cargo y postulante. Permite consultar el listado y el detalle, crear la validación de la Fase 1, guardar la validación del cargo y completar la validación del postulante. | Se utiliza desde los hooks de validación de candidatos. |
| `personnelRequisitionService.ts` | Centraliza las peticiones HTTP del módulo de requisiciones de personal. Incluye operaciones para crear, consultar y gestionar requisiciones, confirmaciones de contratación y candidatos, además de las acciones relacionadas con el cierre, reapertura e historial del cargue de candidatos. | Se utiliza desde los hooks del módulo de Talento Humano para comunicarse con los endpoints del backend relacionados con requisiciones, aprobaciones, contratación y gestión de candidatos. |

---


##### Funciones en `personnelCandidateValidationService.ts`

```txt
getPersonnelCandidateValidations()
getPersonnelCandidateValidationDetail()
createPersonnelCandidateValidation()
updatePersonnelCandidatePositionValidation()
completePersonnelCandidateValidation()
```

| Función | Descripción |
| ------- | ----------- |
| `getPersonnelCandidateValidations()` | Consulta los candidatos disponibles para el módulo de validación junto con el estado resumido del proceso y los permisos de gestión. |
| `getPersonnelCandidateValidationDetail(candidateId)` | Consulta el detalle de un candidato, la requisición, la revisión exacta del perfil y la validación existente cuando aplica. |
| `createPersonnelCandidateValidation(candidateId, data)` | Crea la validación al guardar la Fase 1 con el concepto de aplicación seleccionado. |
| `updatePersonnelCandidatePositionValidation(candidateId, data)` | Guarda la Fase 2 con el tipo de cargo y el código de control de cambios cuando corresponde. |
| `completePersonnelCandidateValidation(candidateId, data)` | Completa la Fase 3 enviando el resultado final y la evaluación de cada descripción de requisito. |

---

##### Funciones en `personnelRequisitionService.ts`

```txt
getDepartments()
createPersonnelRequisition()
getPersonnelRequisitions()
getPersonnelRequisitionById()
decidePersonnelRequisition()
createPersonnelHiringConfirmation()
decidePersonnelHiringConfirmation()
createPersonnelRequisitionCandidate()
getPersonnelRequisitionCandidates()
updatePersonnelRequisitionCandidate()
deletePersonnelRequisitionCandidate()
closePersonnelRequisitionCandidates()
reopenPersonnelRequisitionCandidates()
getPersonnelCandidateSubmissionHistory()
```

| Función | Descripción |
| ------- | ----------- |
| `getDepartments()` | Consulta los departamentos o áreas activas disponibles para crear una requisición de personal. |
| `createPersonnelRequisition(data)` | Envía al backend la información necesaria para crear una nueva requisición de personal. |
| `getPersonnelRequisitions()` | Consulta las requisiciones en las que participa el usuario autenticado. |
| `getPersonnelRequisitionById(requisitionId)` | Consulta el detalle completo de una requisición mediante su identificador. |
| `decidePersonnelRequisition(requisitionId, data)` | Permite aprobar, rechazar o cancelar el paso actual del flujo de una requisición. |
| `createPersonnelHiringConfirmation(requisitionId, data)` | Registra la confirmación final de contratación asociada con una requisición aprobada. |
| `decidePersonnelHiringConfirmation(hiringConfirmationId, data)` | Permite aprobar, rechazar o cancelar el paso actual de una confirmación de contratación. |
| `createPersonnelRequisitionCandidate(requisitionId, data)` | Registra un candidato mediante `multipart/form-data`, enviando tipo de identificación, número de identificación, nombre, observación y hoja de vida. |
| `getPersonnelRequisitionCandidates(requisitionId)` | Consulta los candidatos registrados para una requisición. Mientras el cargue está abierto, la consulta está restringida al Auxiliar de Talento Humano; cuando está cerrado, también pueden consultar los usuarios autorizados para visualizar la requisición. |
| `updatePersonnelRequisitionCandidate(requisitionId, candidateId, data)` | Actualiza los datos o la hoja de vida de un candidato mientras el cargue permanece abierto. |
| `deletePersonnelRequisitionCandidate(requisitionId, candidateId)` | Elimina un candidato y su archivo asociado mientras el cargue permanece abierto. |
| `closePersonnelRequisitionCandidates(requisitionId, data)` | Cierra el cargue. En el primer cierre conserva la fecha en `candidateSubmissionClosedAt`; si se realiza después de `candidateSubmissionDeadlineAt`, envía `lateReason`. En cierres posteriores no vuelve a evaluar el plazo inicial y el primer cierre no cambia. |
| `reopenPersonnelRequisitionCandidates(requisitionId, data)` | Reabre un cargue cerrado enviando obligatoriamente `reason`. Cambia el estado a `ABIERTA`, pero conserva `candidateSubmissionDeadlineAt` y `candidateSubmissionClosedAt`; no concede un nuevo plazo de dos días. |
| `getPersonnelCandidateSubmissionHistory(requisitionId)` | Consulta los registros `REAPERTURA` y `CIERRE` posteriores a la presentación inicial, incluyendo motivo cuando corresponde, usuario responsable y fecha del movimiento. |

---


#### Servicios del módulo de Gestión de Cargos

```txt
services/positionManagement/
├── positionProfileService.ts
└── positionProfileRevisionService.ts
```

| Archivo                             | Descripción                                                                                                                                                                                       | Uso dentro del proyecto                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `positionProfileService.ts`         | Contiene las funciones HTTP utilizadas para consultar los perfiles de cargo activos desde el endpoint de Gestión de Cargos.                                                                       | Se utiliza en los selectores del módulo y también puede ser consumido por el formulario de requisiciones. |
| `positionProfileRevisionService.ts` | Contiene todas las funciones HTTP relacionadas con revisiones, publicación, requisitos y descripciones de perfiles de cargo. También permite consultar la revisión vigente de un perfil de cargo. | Se utiliza desde `usePositionProfileRevisions.ts` y desde `useCreatePersonnelRequisition.ts`.             |

##### Funciones en `positionProfileService.ts`

```txt
getPositionProfiles()
```

| Función                             | Descripción                                                                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `getPositionProfiles(departmentId)` | Consulta los perfiles de cargo activos relacionados con el departamento seleccionado mediante `/position-management/position-profiles`. |

##### Funciones en `positionProfileRevisionService.ts`

```txt
createPositionProfileRevision()
getPositionProfileRevisions()
getPositionProfileRevisionDetail()
getCurrentPositionProfileRevision()
updatePositionProfileRevision()
deletePositionProfileRevision()
publishPositionProfileRevision()
createPositionRequirementDescription()
updatePositionRequirementDescription()
deletePositionRequirementDescription()
```

| Función                                                | Descripción                                                                                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createPositionProfileRevision()`                      | Crea una nueva revisión en estado `BORRADOR`.                                                                                                                            |
| `getPositionProfileRevisions()`                        | Consulta el historial de revisiones de un perfil de cargo.                                                                                                               |
| `getPositionProfileRevisionDetail()`                   | Consulta el detalle de una revisión, sus requisitos y descripciones.                                                                                                     |
| `getCurrentPositionProfileRevision(positionProfileId)` | Consulta la revisión vigente asociada con un perfil de cargo. Cuando el perfil no tiene una revisión vigente, retorna `revision: null` junto con un mensaje informativo. |
| `updatePositionProfileRevision()`                      | Actualiza la observación de una revisión en borrador.                                                                                                                    |
| `deletePositionProfileRevision()`                      | Elimina lógicamente una revisión en borrador.                                                                                                                            |
| `publishPositionProfileRevision()`                     | Publica una revisión y actualiza los estados de las versiones anteriores.                                                                                                |
| `createPositionRequirementDescription()`               | Registra una descripción dentro de un requisito fijo.                                                                                                                    |
| `updatePositionRequirementDescription()`               | Actualiza una descripción existente.                                                                                                                                     |
| `deletePositionRequirementDescription()`               | Elimina lógicamente una descripción.                                                                                                                                     |

---

#### Servicios del módulo de notificaciones

```txt
services/notifications/
└── notificationService.ts
```

| Archivo                  | Descripción                                                                                                       | Uso dentro del proyecto                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `notificationService.ts` | Contiene las funciones HTTP relacionadas con la consulta y gestión de las notificaciones del usuario autenticado. | Se utiliza desde el hook de notificaciones y el componente de campana para cargar notificaciones, consultar el contador de no leídas y actualizar su estado de lectura. |

---

##### Funciones en `notificationService.ts`

```txt
getNotifications()
getUnreadNotificationsCount()
markNotificationAsRead()
markAllNotificationsAsRead()
```

| Función                                  | Descripción                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `getNotifications()`                     | Consulta las notificaciones del usuario autenticado.                    |
| `getUnreadNotificationsCount()`          | Consulta la cantidad de notificaciones que todavía no han sido leídas.  |
| `markNotificationAsRead(notificationId)` | Marca una notificación específica como leída mediante su identificador. |
| `markAllNotificationsAsRead()`           | Marca todas las notificaciones del usuario autenticado como leídas.     |

---

#### Servicios del módulo de PQR

```txt
services/pqrs/
└── pqrService.ts
```

| Archivo         | Descripción                                                                                                              | Uso dentro del proyecto                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `pqrService.ts` | Contiene las funciones HTTP relacionadas con la creación, consulta, asignación, gestión, chat y calificación de las PQR. | Se utiliza desde los hooks y páginas del módulo de PQR para gestionar las solicitudes según el rol del usuario autenticado. |

---

##### Funciones en `pqrService.ts`

```txt
createPqr()
getMyPqrs()
getAllPqrs()
updatePqrStatus()
updatePqrPriority()
getPqrMessages()
markPqrChatAsRead()
sendPqrMessageWithAttachment()
getAvailablePqrs()
takePqr()
assignPqr()
unassignPqr()
getMyAssignedPqrs()
ratePqr()
```

| Función                                              | Descripción                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| `createPqr(data)`                                    | Crea una nueva PQR con su tipo de caso, descripción y archivo adjunto opcional. |
| `getMyPqrs()`                                        | Consulta las PQR creadas por el usuario autenticado.                            |
| `getAllPqrs()`                                       | Consulta todas las PQR registradas en el sistema.                               |
| `updatePqrStatus(id, status)`                        | Actualiza el estado de una PQR mediante su identificador.                       |
| `updatePqrPriority(id, priority)`                    | Actualiza la prioridad de una PQR mediante su identificador.                    |
| `getPqrMessages(pqrId)`                              | Consulta el historial de mensajes de una PQR.                                   |
| `markPqrChatAsRead(pqrId)`                           | Marca como leído el chat de una PQR para el usuario autenticado.                |
| `sendPqrMessageWithAttachment(pqrId, file, content)` | Envía un mensaje con archivo adjunto y contenido de texto opcional.             |
| `getAvailablePqrs()`                                 | Consulta las PQR disponibles para ser tomadas por un agente.                    |
| `takePqr(pqrId)`                                     | Permite que el agente autenticado tome una PQR disponible.                      |
| `assignPqr(pqrId, agentId)`                          | Permite asignar o reasignar una PQR a un agente.                                |
| `unassignPqr(pqrId)`                                 | Permite desasignar el agente responsable de una PQR.                            |
| `getMyAssignedPqrs()`                                | Consulta las PQR asignadas al agente autenticado.                               |
| `ratePqr(pqrId, data)`                               | Registra la calificación de una PQR cerrada.                                    |

---

#### Servicios de Socket.IO

```txt
services/sockets/
└── socketService.ts
```

| Archivo            | Descripción                                                                                        | Uso dentro del proyecto                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `socketService.ts` | Contiene las funciones encargadas de crear y administrar la conexión en tiempo real con Socket.IO. | Se utiliza en el chat de PQR y en el sistema de notificaciones para enviar y recibir eventos sin recargar la aplicación. |

---

##### Funciones en `socketService.ts`

```txt
connectSocket()
getSocket()
joinPqrRoom()
sendPqrMessage()
listenJoinedPqrRoom()
listenNewPqrMessage()
listenPqrUnreadCountUpdated()
listenNewNotification()
listenSocketError()
removePqrSocketListeners()
removeNotificationSocketListeners()
disconnectSocket()
```

| Función                                 | Descripción                                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `connectSocket(token)`                  | Crea la conexión con Socket.IO utilizando el token del usuario autenticado y evita conexiones duplicadas. |
| `getSocket()`                           | Retorna la instancia actual del socket o `null` cuando no existe una conexión.                            |
| `joinPqrRoom(pqrId)`                    | Une al usuario autenticado a la sala correspondiente a una PQR.                                           |
| `sendPqrMessage(pqrId, content)`        | Envía un mensaje de texto dentro del chat de una PQR.                                                     |
| `listenJoinedPqrRoom(callback)`         | Escucha la confirmación del backend cuando el usuario ingresa a la sala de una PQR.                       |
| `listenNewPqrMessage(callback)`         | Escucha los nuevos mensajes recibidos en el chat de PQR.                                                  |
| `listenPqrUnreadCountUpdated(callback)` | Escucha las actualizaciones del contador de mensajes no revisados de una PQR.                             |
| `listenNewNotification(callback)`       | Escucha las nuevas notificaciones recibidas en tiempo real.                                               |
| `listenSocketError(callback)`           | Escucha los errores enviados por el backend mediante Socket.IO.                                           |
| `removePqrSocketListeners()`            | Elimina los listeners relacionados con el chat de PQR para evitar eventos duplicados.                     |
| `removeNotificationSocketListeners()`   | Elimina el listener relacionado con las notificaciones en tiempo real.                                    |
| `disconnectSocket()`                    | Desconecta el socket y elimina la instancia cuando el usuario cierra sesión.                              |

---

#### Servicios del módulo de usuarios

```txt
services/users/
└── userService.ts
```

| Archivo          | Descripción                                                                                                                                                                                              | Uso dentro del proyecto                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `userService.ts` | Contiene las funciones HTTP relacionadas con la consulta y administración de usuarios, cambio de roles, registro de la firma del usuario autenticado y carga masiva de usuarios mediante archivos Excel. | Se utiliza desde los hooks y componentes del módulo de usuarios para consultar información, actualizar roles, cargar firmas y registrar usuarios de forma masiva. |

---

##### Funciones en `userService.ts`

```txt
getAllUsers()
getAgents()
updateUserRole()
uploadUserSignature()
uploadUsersBulk()
```

| Función                        | Descripción                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `getAllUsers()`                | Consulta todos los usuarios registrados en el sistema.                                                        |
| `getAgents()`                  | Consulta únicamente los usuarios que tienen el rol `AGENT`.                                                   |
| `updateUserRole(userId, role)` | Actualiza el rol de un usuario mediante su identificador.                                                     |
| `uploadUserSignature(file)`    | Registra o actualiza la firma del usuario autenticado mediante un archivo enviado como `multipart/form-data`. |
| `uploadUsersBulk(file)`        | Registra varios usuarios mediante la carga de un archivo Excel enviado como `multipart/form-data`.            |

---


### `src/styles/`

Esta carpeta contiene estilos reutilizables del proyecto que pueden ser compartidos entre diferentes páginas y componentes.

Su objetivo principal es centralizar configuraciones visuales repetidas, evitar declarar los mismos estilos directamente dentro de las vistas y mantener una apariencia consistente en toda la aplicación.

Los estilos pueden utilizar la configuración definida en el tema de Material UI, permitiendo que los colores y estados visuales dependan de la paleta global del sistema en lugar de utilizar valores de color escritos directamente en los componentes.

**Estructura:**

```txt
styles/
├── filterStyles.ts
└── tableStyles.ts
```

| Archivo | Descripción | Uso dentro del proyecto |
| ------- | ----------- | ----------------------- |
| `filterStyles.ts` | Contiene estilos reutilizables para controles de búsqueda, filtros, botones de acciones y menús de filtrado. | Se utiliza en páginas con tablas o listados que incluyen búsqueda, filtros y acciones de actualización. |
| `tableStyles.ts` | Contiene estilos reutilizables para elementos visuales de tablas y listados. | Se utiliza en listados que compartan estilos de numeración o botones de acción. |

---

#### Responsabilidad principal

```txt
Centralizar estilos reutilizables del frontend.
Evitar repetir configuraciones visuales en páginas y componentes.
```

---

#### `filterStyles.ts`

El archivo `filterStyles.ts` contiene los estilos reutilizables utilizados principalmente en controles de búsqueda y filtrado.

La función `getFilterStyles(theme)` recibe el tema activo de Material UI para construir los estilos de acuerdo con la paleta visual configurada en la aplicación.

| Estilo | Descripción | Uso dentro del proyecto |
| ------ | ----------- | ----------------------- |
| `searchInput` | Define la apariencia del campo de búsqueda utilizado en los encabezados de listados. | Se utiliza en páginas que permiten buscar registros dentro de tablas o listados. |
| `iconButton` | Define el estilo estándar de los botones utilizados para acciones como búsqueda, filtros o actualización. | Se utiliza en controles de acciones ubicados en encabezados de tablas. |
| `activeIconButton` | Define el estilo visual de un botón cuando existe una búsqueda o filtro activo. | Se utiliza para indicar visualmente que existe un filtro aplicado. |
| `smallFilterMenuPaper` | Define el contenedor visual de los menús pequeños de filtrado. | Se utiliza en menús desplegables de filtros. |
| `smallFilterMenuContent` | Organiza el contenido interno de los menús de filtrado. | Se utiliza para distribuir selectores y acciones dentro de los filtros. |
| `smallFilterTitle` | Define el estilo de los títulos utilizados dentro de un menú de filtro. | Se utiliza para identificar el criterio que se está filtrando. |
| `filterSelect` | Define el estilo de los selectores utilizados dentro de los filtros. | Se utiliza en filtros por rol, estado u otras categorías. |
| `clearFilterButtonWithMargin` | Define el estilo del botón utilizado para limpiar un filtro aplicado. | Se utiliza dentro de los menús de filtrado. |

---

#### `tableStyles.ts`

El archivo `tableStyles.ts` contiene estilos reutilizables para elementos visuales utilizados dentro de tablas y listados del sistema.

La función `getTableStyles(theme)` recibe el tema activo de Material UI y obtiene los colores desde `theme.palette`. Esto evita declarar colores hexadecimales directamente dentro de las páginas y permite mantener los estilos sincronizados con la identidad visual general de la aplicación.

```txt
getTableStyles(theme)
```

| Estilo | Descripción | Uso dentro del proyecto |
| ------ | ----------- | ----------------------- |
| `rowNumber` | Define el estilo utilizado para mostrar el número consecutivo de una fila. Utiliza `text.secondary` de la paleta y aplica un peso de fuente destacado. | Se utiliza en la columna `#` de las tablas del sistema. |
| `primaryActionButton` | Define el estilo de los botones de acción principales dentro de una tabla. Utiliza `primary.main` y genera fondos suaves mediante `alpha()`, incluyendo el estado `hover`. | Se utiliza en acciones como editar, iniciar, continuar o visualizar un proceso. |
| `neutralActionButton` | Define el estilo de acciones secundarias utilizando valores de `action.hover`, `action.selected` y `text.secondary` de la paleta. | Puede utilizarse en acciones como actualizar listados, cargar archivos u otros controles secundarios. |

---

### `src/theme/`

Esta carpeta contiene la configuración del tema visual de Material UI.

**Ejemplo:**

```txt
theme/
└── theme.ts
```

Aquí se definen colores, tipografías, fondos y estilos base del sistema.

**Responsabilidad principal:**

```txt
Centralizar la identidad visual del proyecto.
```

---

### `src/templates/`

Esta carpeta contiene archivos encargados de generar plantillas descargables desde el frontend.

A diferencia de `utils/`, esta carpeta no se usa para guardar funciones auxiliares pequeñas, sino archivos que construyen documentos completos, como plantillas de Excel, formatos de carga masiva o archivos base que el usuario puede descargar y diligenciar.

**Estructura:**

```txt
templates/
└── users/
    └── downloadBulkUsersTemplate.ts
```

---

#### `downloadBulkUsersTemplate.ts`

Este archivo contiene la función encargada de generar y descargar la plantilla de Excel para la carga masiva.

```txt
downloadBulkUsersTemplate()
```

| Función                       | Descripción                                                                                                                                                                                       | Uso dentro del proyecto                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `downloadBulkUsersTemplate()` | Genera un archivo Excel con las columnas necesarias para registrar usuarios de forma masiva. También aplica estilos, comentarios de ayuda, validación de roles y descarga automática del archivo. | Se utiliza en el módulo de administración de usuarios para que el administrador pueda descargar una plantilla base y registrar varios usuarios desde un archivo Excel. |

---

### `src/utils/`

Esta carpeta contiene funciones auxiliares reutilizables del proyecto.

Los archivos ubicados en `utils/` no representan componentes visuales, páginas, hooks ni servicios. Su función principal es centralizar lógica pequeña y reutilizable que puede utilizarse en diferentes partes del frontend.

---

#### Estructura

```txt
utils/
│
├── common/
│   ├── avatarUtils.ts
│   ├── dateUtils.ts
│   ├── excelUtils.ts
│   ├── fileUrl.ts
│   ├── fileUtils.ts
│   ├── formatText.ts
│   ├── getErrorMessage.ts
│   └── numberUtils.ts
│
├── humanTalent/
│   └── personnelRequisitionUtils.ts
│
├── pqrs/
│   └── pqrUtils.ts
│
└── users/
    └── userRoleUtils.tsx
```

---

#### Responsabilidad principal de `utils/`

```txt
Centralizar funciones auxiliares reutilizables y evitar repetir lógica dentro de componentes, páginas, hooks o servicios.
```

**Las utilidades deben realizar tareas específicas como:**

```txt
Formatear fechas, números, textos y valores monetarios.
Construir direcciones de archivos.
Interpretar errores del backend.
Transformar estados en colores o etiquetas.
Organizar información para mostrarla en componentes.
```

---

#### Utilidades comunes

```txt
utils/common/
├── avatarUtils.ts
├── dateUtils.ts
├── excelUtils.ts
├── fileUrl.ts
├── fileUtils.ts
├── formatText.ts
├── getErrorMessage.ts
└── numberUtils.ts
```

Los archivos ubicados en `utils/common/` contienen funciones generales que pueden utilizarse en diferentes módulos del sistema.

| Archivo              | Descripción                                                                                                                | Uso dentro del proyecto                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `avatarUtils.ts`     | Contiene funciones auxiliares relacionadas con la representación visual de nombres de usuarios.                            | Se utiliza en avatares y componentes donde se necesitan mostrar las iniciales de una persona.                                |
| `dateUtils.ts`       | Contiene funciones auxiliares relacionadas con la transformación y presentación de fechas.                                 | Se utiliza para mostrar fechas de registros, mensajes, requisiciones, aprobaciones, notificaciones y otros datos temporales. |
| `excelUtils.ts`      | Contiene funciones auxiliares relacionadas con la transformación de valores utilizados al generar archivos de Excel.       | Se utiliza para adaptar colores de la interfaz al formato requerido por ExcelJS.                                             |
| `fileUrl.ts`         | Contiene funciones auxiliares para construir direcciones completas de archivos e imágenes almacenados en el backend.       | Se utiliza para mostrar firmas, archivos adjuntos, imágenes y otros recursos cuya ruta es enviada de forma relativa.         |
| `fileUtils.ts`       | Contiene funciones auxiliares relacionadas con la conversión y presentación del tamaño de archivos.                        | Se utiliza para mostrar de manera legible el tamaño de archivos seleccionados, cargados o adjuntos.                          |
| `formatText.ts`      | Contiene funciones auxiliares para transformar textos técnicos y obtener etiquetas legibles.                               | Se utiliza en formularios, detalles, listas y componentes que necesitan presentar valores de forma clara.                    |
| `getErrorMessage.ts` | Contiene una función auxiliar encargada de obtener mensajes claros a partir de errores producidos durante peticiones HTTP. | Se utiliza en hooks, páginas y componentes para mostrar mensajes comprensibles cuando ocurre un error.                       |
| `numberUtils.ts`     | Contiene funciones auxiliares relacionadas con la limpieza, presentación y formato de valores numéricos y monetarios.      | Se utiliza en formularios, detalles y componentes donde se manejan salarios, montos, cuotas, abonos y saldos.                |

---

##### Funciones en `avatarUtils.ts`

```txt
getInitials()
```

| Función             | Descripción                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `getInitials(name)` | Obtiene las iniciales de las primeras dos palabras de un nombre. Cuando no recibe un nombre válido, retorna `?`. |

---

##### Funciones en `dateUtils.ts`

```txt
formatDate()
```

| Función             | Descripción                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `formatDate(value)` | Convierte una fecha en un formato numérico legible según la configuración regional de Colombia. Cuando no recibe una fecha válida, retorna `____/____/____`. |

---

##### Funciones en `excelUtils.ts`

```txt
toExcelColor()
```

| Función               | Descripción                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `toExcelColor(color)` | Convierte un color hexadecimal, como `#1565c0`, al formato ARGB utilizado por ExcelJS, como `FF1565C0`. |

---

##### Funciones en `fileUrl.ts`

```txt
buildFileUrl()
```

| Función                 | Descripción                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `buildFileUrl(fileUrl)` | Convierte una ruta relativa del backend en una URL completa. Cuando recibe una URL que comienza con `http`, la retorna sin modificaciones; cuando no recibe una ruta válida, retorna una cadena vacía. |

---

##### Funciones en `fileUtils.ts`

```txt
formatFileSize()
```

| Función                | Descripción                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `formatFileSize(size)` | Convierte el tamaño de un archivo expresado en bytes a kilobytes o megabytes para mostrarlo de manera legible. |

---

##### Funciones en `formatText.ts`

```txt
capitalizeText()
getOptionLabel()
```

| Función                          | Descripción                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capitalizeText(text)`           | Convierte un texto a minúsculas y deja únicamente la primera letra en mayúscula. Cuando recibe una cadena vacía, retorna una cadena vacía.                                      |
| `getOptionLabel(value, options)` | Busca en una lista de opciones la etiqueta correspondiente a un valor. Cuando no encuentra una coincidencia, retorna el mismo valor; cuando no recibe un valor, retorna `null`. |

---

##### Funciones en `getErrorMessage.ts`

```txt
getErrorMessage()
```

| Función                                  | Descripción                                                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getErrorMessage(error, defaultMessage)` | Analiza un error y retorna un mensaje apropiado. Diferencia errores de conexión, errores internos del servidor y mensajes enviados por el backend. |

---

##### Funciones en `numberUtils.ts`

```txt
cleanNumberInput()
formatNumberInput()
formatMoney()
```

| Función                    | Descripción                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cleanNumberInput(value)`  | Elimina letras, espacios, símbolos y cualquier otro carácter que no sea numérico.                                                                                                                       |
| `formatNumberInput(value)` | Formatea un valor numérico utilizando separadores de miles según la configuración regional de Colombia.                                                                                                 |
| `formatMoney(value)`       | Convierte un valor numérico a formato de moneda colombiana en pesos. Cuando el valor está vacío retorna una cadena vacía y, cuando no puede convertirse a número, retorna el valor original como texto. |

---

#### Utilidades del módulo de Talento Humano

```txt
utils/humanTalent/
└── personnelRequisitionUtils.ts
```

Los archivos ubicados en `utils/humanTalent/` contienen funciones específicas relacionadas con el flujo y la presentación de las requisiciones de personal.

| Archivo                        | Descripción                                                                                                                      | Uso dentro del proyecto                                                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `personnelRequisitionUtils.ts` | Contiene funciones auxiliares específicas para organizar, transformar y presentar la información de una requisición de personal. | Se utiliza en páginas de detalle, formatos imprimibles y componentes relacionados con aprobaciones, valores monetarios, estados y comentarios. |

---

##### Funciones en `personnelRequisitionUtils.ts`

```txt
hasValue()
formatOptionalMoney()
getRequisitionStatusColor()
getRequisitionApprovalSlots()
getHiringApprovalSlots()
getRequisitionStatusComment()
```

| Función                                    | Descripción                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `hasValue(value)`                          | Verifica si un valor contiene información y no corresponde a `null`, `undefined` o una cadena vacía.                               |
| `formatOptionalMoney(value)`               | Convierte un valor existente a formato de moneda mediante `formatMoney()`. Cuando no recibe información, retorna una cadena vacía. |
| `getRequisitionStatusColor(status)`        | Retorna el color visual correspondiente al estado general de una requisición de personal.                                          |
| `getRequisitionApprovalSlots(approvals)`   | Ordena las aprobaciones iniciales y las distribuye entre jefe de área, jefe de departamento y gerente general.                     |
| `getHiringApprovalSlots(approvals)`        | Distribuye las aprobaciones de la confirmación de contratación entre el analista y el jefe de Talento Humano.                      |
| `getRequisitionStatusComment(requisition)` | Obtiene el comentario más reciente relacionado con el rechazo o cancelación de una requisición y define cómo debe mostrarse.       |

---

#### Utilidades del módulo de PQR

```txt
utils/pqrs/
└── pqrUtils.ts
```

Los archivos ubicados en `utils/pqrs/` contienen funciones específicas relacionadas con la presentación de la información del módulo de PQR.

| Archivo       | Descripción                                                                                                             | Uso dentro del proyecto                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pqrUtils.ts` | Contiene funciones auxiliares relacionadas con la presentación visual de los estados y tipos de caso del módulo de PQR. | Se utiliza en listas, tarjetas, detalles y componentes para mostrar colores y textos legibles. |

---

##### Funciones en `pqrUtils.ts`

```txt
getStatusColor()
getCaseTypeLabel()
```

| Función                      | Descripción                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `getStatusColor(status)`     | Retorna el color de Material UI correspondiente al estado de una PQR para mostrarlo en componentes como `Chip`.                         |
| `getCaseTypeLabel(caseType)` | Convierte el valor técnico del tipo de caso en una etiqueta más clara. Cuando no encuentra una coincidencia, retorna el valor recibido. |

---

#### Utilidades del módulo de usuarios

```txt
utils/users/
└── userRoleUtils.tsx
```

Los archivos ubicados en `utils/users/` contienen funciones específicas relacionadas con la presentación de los roles de usuario.

| Archivo             | Descripción                                                                                                | Uso dentro del proyecto                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `userRoleUtils.tsx` | Contiene funciones auxiliares relacionadas con la representación visual y textual de los roles de usuario. | Se utiliza en listas, tablas, tarjetas y componentes donde se necesita mostrar el color, ícono o nombre legible de un rol. |

---

##### Funciones en `userRoleUtils.tsx`

```txt
getUserRoleColor()
getUserRoleIcon()
getUserRoleLabel()
```

| Función                  | Descripción                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `getUserRoleColor(role)` | Retorna el color de Material UI correspondiente al rol del usuario para mostrarlo en componentes como `Chip`. |
| `getUserRoleIcon(role)`  | Retorna el ícono correspondiente al rol del usuario.                                                          |
| `getUserRoleLabel(role)` | Convierte el valor técnico del rol en una etiqueta legible como `Administrador`, `Agente` o `Usuario`.        |

---

#### Regla de organización de utilidades

```txt
Las funciones reutilizables por varios módulos deben ubicarse en utils/common.
Las funciones exclusivas de un módulo deben ubicarse en utils/nombreModulo.
Los archivos de utils no deben realizar peticiones HTTP.
Los archivos de utils no deben manejar estados de React.
Cada función debe cumplir una responsabilidad específica y reutilizable.
```

Esta organización permite mantener separadas las transformaciones generales de las funciones específicas de cada módulo y facilita encontrar rápidamente la utilidad necesaria.

---

### `src/validations/`

Esta carpeta contiene los esquemas de validación del proyecto, normalmente creados con Yup.

Las validaciones permiten controlar que los datos ingresados en los formularios cumplan con las reglas necesarias antes de ser enviados al backend. De esta manera, se evitan envíos incompletos, datos inválidos o errores que pueden prevenirse desde el frontend.

---

#### Estructura

```txt
validations/
│
├── auth/
│   └── authValidation.ts
│
├── humanTalent/
│   ├── candidateSubmission/
│   │   └── personnelRequisitionCandidateValidation.ts
│   │
│   ├── candidateValidation/
│   │   └── personnelCandidateValidation.ts
│   │
│   └── requisitions/
│       └── personnelRequisitionValidation.ts
│
├── positionManagement/
│   └── positionProfileRevisionValidation.ts
│
└── pqrs/
    └── pqrValidation.ts
```

---

#### Validaciones del módulo de autenticación

```txt
validations/auth/
└── authValidation.ts
```

##### `authValidation.ts`

Este archivo contiene las reglas de validación relacionadas con los formularios de autenticación del sistema.

Se utiliza para validar los datos ingresados por el usuario antes de iniciar sesión o registrarse.

```txt
loginSchema()
registerSchema()
```

| Esquema            | Descripción                                                                                    | Uso dentro del proyecto         |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| `loginSchema()`    | Valida los datos necesarios para iniciar sesión, como correo y contraseña.                     | Se utiliza en `useLogin.ts`.    |
| `registerSchema()` | Valida los datos necesarios para registrar un nuevo usuario, como nombre, correo y contraseña. | Se utiliza en `useRegister.ts`. |

Este archivo permite mantener las reglas de autenticación centralizadas y evita repetir validaciones directamente en las páginas `Login.tsx` o `Register.tsx`.

---

#### Validaciones del módulo de Talento Humano

Las validaciones se separan en `candidateSubmission/`, `candidateValidation/` y `requisitions/` según el proceso al que pertenecen.


```txt
validations/humanTalent/
├── candidateSubmission/
│   └── personnelRequisitionCandidateValidation.ts
│
├── candidateValidation/
│   └── personnelCandidateValidation.ts
│
└── requisitions/
    └── personnelRequisitionValidation.ts
```


##### `personnelCandidateValidation.ts`

Este archivo contiene los esquemas Yup utilizados en las tres fases de la validación de cargo y postulante.

```txt
candidateApplicationConceptSchema
candidatePositionValidationSchema
candidateValidationSchema
```

| Esquema | Descripción | Uso dentro del proyecto |
| ------- | ----------- | ----------------------- |
| `candidateApplicationConceptSchema` | Valida que el usuario seleccione un concepto de aplicación permitido antes de crear la validación. | Se utiliza al guardar la Fase 1. |
| `candidatePositionValidationSchema` | Valida el tipo de cargo y exige el código de control de cambios cuando se selecciona `NUEVO_CARGO`. | Se utiliza al guardar la Fase 2. |
| `candidateValidationSchema` | Valida el resultado final y cada descripción de requisito. Cuando `complies` es `true`, exige evidencia; cuando es `false`, exige cierre de brecha. | Se utiliza al completar la Fase 3. |

---

##### `personnelRequisitionValidation.ts`

Este archivo contiene las reglas de validación relacionadas con el formulario de creación de requisición de personal.

```txt
createPersonnelRequisitionSchema()
```

| Esquema                              | Descripción                                                                                                                                                                                                                                                                                                                                       | Uso dentro del proyecto                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `createPersonnelRequisitionSchema()` | Valida los datos necesarios para crear una requisición de personal, como área, cargo, revisión vigente, motivo, ciudad, tipo de contratación y salario propuesto. La revisión es obligatoria y se obtiene automáticamente del cargo seleccionado. También valida campos condicionales como motivo `OTROS`, contrato fijo, temporal o practicante. | Se utiliza en `useCreatePersonnelRequisition.ts`. |

---

##### `personnelRequisitionCandidateValidation.ts`

Este archivo contiene las reglas de validación utilizadas para registrar y actualizar candidatos, así como para validar los motivos relacionados con el cierre tardío y la reapertura del cargue.

```txt
createPersonnelRequisitionCandidateSchema()
updatePersonnelRequisitionCandidateSchema()
closePersonnelRequisitionCandidatesSchema()
reopenPersonnelRequisitionCandidatesSchema()
```

| Esquema | Descripción | Uso dentro del proyecto |
| ------- | ----------- | ----------------------- |
| `createPersonnelRequisitionCandidateSchema()` | Valida que el tipo y número de identificación sean obligatorios, que el número contenga únicamente dígitos y no supere 50 caracteres, que el nombre sea obligatorio, contenga solo letras y tenga entre 3 y 150 caracteres, que la observación no supere 500 caracteres y que la hoja de vida sea obligatoria, corresponda a PDF, DOC o DOCX y no supere 5 MB. | Se utiliza al registrar un candidato desde `usePersonnelRequisitionCandidates.ts`. |
| `updatePersonnelRequisitionCandidateSchema()` | Aplica las mismas reglas para identificación, nombre y observación. La hoja de vida es opcional para permitir conservar el documento actual cuando solo se modifican los demás datos. | Se utiliza al actualizar un candidato desde `usePersonnelRequisitionCandidates.ts`. |
| `closePersonnelRequisitionCandidatesSchema()` | Valida `lateReason` cuando se envía: debe tener mínimo 3 y máximo 500 caracteres. El campo no se hace obligatorio de forma general, porque solo debe exigirse cuando el hook detecta que el primer cierre está fuera de `candidateSubmissionDeadlineAt`. | Se utiliza al cerrar el cargue de candidatos. |
| `reopenPersonnelRequisitionCandidatesSchema()` | Valida que `reason` sea obligatorio en toda reapertura y tenga entre 3 y 500 caracteres. | Se utiliza antes de reabrir el cargue. |

---


#### Validaciones del módulo de Gestión de Cargos

```txt
validations/positionManagement/
└── positionProfileRevisionValidation.ts
```

##### `positionProfileRevisionValidation.ts`

Este archivo contiene los esquemas de validación utilizados para crear o actualizar revisiones y descripciones de requisitos.

```txt
createPositionProfileRevisionSchema()
updatePositionProfileRevisionSchema()
createPositionRequirementDescriptionSchema()
updatePositionRequirementDescriptionSchema()
```

| Esquema                                        | Descripción                                                                                 | Uso dentro del proyecto                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `createPositionProfileRevisionSchema()`        | Valida la observación opcional al crear una revisión y limita su longitud a 500 caracteres. | Se utiliza en `usePositionProfileRevisions.ts`. |
| `updatePositionProfileRevisionSchema()`        | Valida la observación enviada al actualizar una revisión en estado `BORRADOR`.              | Se utiliza en `usePositionProfileRevisions.ts`. |
| `createPositionRequirementDescriptionSchema()` | Valida que la descripción sea obligatoria y no supere 500 caracteres.                       | Se utiliza al agregar una descripción.          |
| `updatePositionRequirementDescriptionSchema()` | Aplica las reglas necesarias para actualizar una descripción existente.                     | Se utiliza al editar una descripción.           |

---

#### Validaciones del módulo de PQR

```txt
validations/pqrs/
└── pqrValidation.ts
```

##### `pqrValidation.ts`

Este archivo contiene las reglas de validación relacionadas con el módulo de PQR.

Se utiliza principalmente para validar los datos del formulario de creación de una solicitud, antes de enviarla al backend.

```txt
createPqrSchema()
```

| Esquema             | Descripción                                                                            | Uso dentro del proyecto                             |
| ------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `createPqrSchema()` | Valida los datos necesarios para crear una nueva PQR, como tipo de caso y descripción. | Se utiliza en hooks y páginas relacionadas con PQR. |

Este archivo permite validar que la información ingresada por el usuario sea correcta antes de crear una solicitud PQR.

---

## 4. Archivos principales

### `App.tsx`

Es el componente principal de la aplicación.

Normalmente aquí se cargan las rutas principales del sistema.

**Responsabilidad principal:**

```txt
Servir como componente base de la aplicación.
```

---

### `main.tsx`

Es el punto de entrada del proyecto React.

Aquí se renderiza la aplicación y se configuran elementos globales como:

```txt
BrowserRouter
ThemeProvider
AuthProvider
CssBaseline
```

**Responsabilidad principal:**

```txt
Inicializar la aplicación.
```

---

## 5. Conclusión

Esta estructura permite que el proyecto crezca de forma organizada, clara y profesional.
Al separar páginas, componentes, servicios, hooks, datos, validaciones y utilidades, el código se vuelve más fácil de mantener, reutilizar y escalar.

Además, el enfoque de componentes reutilizables permite que elementos como tablas, encabezados, mensajes y estados vacíos puedan usarse en diferentes módulos sin repetir código.
