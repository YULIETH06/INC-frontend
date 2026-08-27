export interface MenuOption {
  label: string;
  path: string;
  roles: string[];
  positionCodes?: string[];
}

export interface MenuSubmodule {
  name: string;
  options: MenuOption[];
}

export interface MenuModule {
  module: string;
  submodules: MenuSubmodule[];
}

const requisitionCreatePositionCodes = [
  "SUBGERENTE_GENERAL", // Subgerente General
  "DPC-TH-0002", // Director de Operaciones
  "DPC-TH-0008", // Jefe de Producción
  "DPC-TH-0005", // Jefe de Aseguramiento de Calidad
  "DPC-TH-0006", // Jefe de Control de Calidad
  "DPC-TH-0009", // Jefe de Planeación y Distribución
  "DPC-TH-0004", // Jefe de Investigación & Desarrollo
  "DPC-TH-0007", // Jefe de Mantenimiento
  "DPC-TH-0132", // Coordinador de Planeación y Control de la Producción
  "DPC-TH-0028", // Coordinador de Sistemas de Gestión Integral SST-GA
  "DPC-TH-0076", // Coordinador de Asuntos Regulatorios
  "DPC-TH-0073", // Gerente Ejecutivo
  "DPC-TH-0012", // Jefe de Nuevos Negocios
  "DPC-TH-0060", // Jefe Nacional de Ventas Farma y Consumo
  "DPC-TH-0059", // Jefe de Producto
  "GERENTE_FINANCIERO", // Gerente Financiero
  "JEFE_CONTABILIDAD", // Jefe de Contabilidad
  "DPC-TH-0033", // Jefe de Suministros
  "DPC-TH-0003", // Jefe de Talento Humano
  "DPC-TH-0169", // Jefe de Tecnología e Inteligencia de Negocio
];

const requisitionViewPositionCodes = [
  ...requisitionCreatePositionCodes,
  "DPC-TH-0080", // Auxiliar de Talento Humano: puede ver, pero no crear
];

export const menuItems: MenuModule[] = [
  {
    module: "PQR",
    submodules: [
      {
        name: "Mis solicitudes PQR",
        options: [
          {
            label: "Ver mis PQR",
            path: "/dashboard/pqrs/my",
            roles: ["USER", "AGENT"],
          },
          {
            label: "Crear nueva PQR",
            path: "/dashboard/pqrs/create",
            roles: ["USER", "AGENT"],
          },
        ],
      },
      {
        name: "Atención de solicitudes PQR",
        options: [
          {
            label: "PQR asignadas",
            path: "/agent/pqrs",
            roles: ["AGENT"],
          },
        ],
      },
      {
        name: "Administración de PQR",
        options: [
          {
            label: "Todas las PQR",
            path: "/dashboard/pqrs",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },

  {
    module: "Talento Humano",
    submodules: [
      {
        name: "Requisiciones de personal",
        options: [
          {
            label: "Ver requisiciones",
            path: "/dashboard/human-talent/requisitions",
            roles: ["ADMIN", "USER"],
            positionCodes: requisitionViewPositionCodes,
          },
          {
            label: "Crear requisición",
            path: "/dashboard/human-talent/requisitions/create",
            roles: ["ADMIN", "USER"],
            positionCodes: requisitionCreatePositionCodes,
          },
        ],
      },
      // {
      //   name: "Validación de postulantes",
      //   options: [
      //     {
      //       label: "Validación de cargo y postulante",
      //       path: "/dashboard/human-talent/candidate-validations",
      //       roles: ["ADMIN", "USER"],
      //       positionCodes: [
      //         "DPC-TH-0003", // Jefe de Talento Humano
      //         "DPC-TH-0080", // Auxiliar de Talento Humano
      //       ],
      //     },
      //   ],
      // },
    ],
  },

  {
    module: "Gestión de Cargos",
    submodules: [
      {
        name: "Perfiles de cargo",
        options: [
          {
            label: "Gestionar perfiles de cargo",
            path: "/dashboard/position-management/position-profiles",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },

  {
    module: "Usuarios",
    submodules: [
      {
        name: "Gestión de usuarios",
        options: [
          {
            label: "Administrar usuarios",
            path: "/users",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];
