import { Route } from "@angular/router";

import { AuthGuard } from "./core/auth/guards/auth.guard";
import { RoleGuard } from "./core/auth/guards/role.guard";
import { LayoutComponent } from "./layout/layout.component";
import { NoAuthGuard } from "./core/auth/guards/no-auth.guard";

export const appRoutes: Route[] = [
  {
    path: "",
    children: [
      {
        path: "",
        loadChildren: () => import("./modules/landing/landing.module").then((m) => m.LandingModule),
      },
      {
        path: "privacidade",
        data: {
          title: "Politica de privacidade",
        },
        loadChildren: () => import("./modules/privacy-policy/privacy-policy.module").then((m) => m.PrivacyPolicyModule),
      },
      {
        path: "termos",
        data: {
          title: "Termos de uso",
        },
        loadChildren: () => import("./modules/terms/terms.module").then((m) => m.TermsModule),
      },
    ],
  },
  { path: "-", pathMatch: "full", redirectTo: "dashboard" },
  {
    path: "",
    canActivate: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "login",
        loadChildren: () => import("./modules/auth/sign-in/sign-in.module").then((m) => m.AuthSignInModule),
      },
      {
        path: "registrar",
        loadChildren: () => import("./modules/auth/sign-up/sign-up.module").then((m) => m.AuthSignUpModule),
      },
      {
        path: "esqueci-minha-senha",
        loadChildren: () => import("./modules/auth/forgot-password/forgot-password.module").then((m) => m.AuthForgotPasswordModule),
      },
      {
        path: "redefinir-senha",
        loadChildren: () => import("./modules/auth/reset-password/reset-password.module").then((m) => m.AuthResetPasswordModule),
      },
    ],
  },
  {
    path: "",
    canMatch: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: "sidebar",
    },
    children: [
      {
        path: "dashboard",
        canMatch: [RoleGuard],
        data: {
          title: "Aplicações",
          menuKey: "DASHBOARD",
        },
        loadChildren: () => import("./modules/admin/dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "acoes",
        canMatch: [RoleGuard],
        data: {
          title: "Ações",
          menuKey: "ACTIONS",
        },
        loadChildren: () => import("./modules/admin/actions/actions.module").then((m) => m.ActionsModule),
      },
      {
        path: "empresas",
        canMatch: [RoleGuard],
        data: {
          title: "Empresas",
          menuKey: "COMPANIES",
        },
        loadChildren: () => import("./modules/admin/companies/companies.module").then((m) => m.CompaniesModule),
      },
      {
        path: "menus",
        canMatch: [RoleGuard],
        data: {
          title: "Menus",
          menuKey: "MENUS",
        },
        loadChildren: () => import("./modules/admin/menus/menus.module").then((m) => m.MenusModule),
      },
      {
        path: "perfis-de-acessos",
        canMatch: [RoleGuard],
        data: {
          title: "Perfis de Acessos",
          menuKey: "ROLES",
        },
        loadChildren: () => import("./modules/admin/roles/roles.module").then((m) => m.RolesModule),
      },
      {
        path: "tipo-de-empresa",
        canMatch: [RoleGuard],
        data: {
          title: "Tipo de Empresa",
          menuKey: "COMPANIES-TYPE",
        },
        loadChildren: () => import("./modules/admin/companies-types/companies-types.module").then((m) => m.CompaniesTypesModule),
      },
      {
        path: "termo-de-servico",
        canMatch: [RoleGuard],
        data: {
          title: "Termo de Serviço",
          menuKey: "TERMS-SERVICE",
        },
        loadChildren: () => import("./modules/admin/term-user/term-user.module").then((m) => m.TermUserModule),
      },
      {
        path: "usuarios",
        canMatch: [RoleGuard],
        data: {
          title: "Usuários",
          menuKey: "USERS",
        },
        loadChildren: () => import("./modules/admin/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "parametros-de-sistema",
        canMatch: [RoleGuard],
        data: {
          title: "Parâmetros de Sistema",
          menuKey: "PARAMETERS",
        },
        loadChildren: () => import("./modules/admin/parameters/parameters.module").then((m) => m.ParametersModule),
      },
      {
        path: "consultores",
        canMatch: [RoleGuard],
        data: {
          title: "Consultores",
          menuKey: "CONSULTANTS",
        },
        loadChildren: () => import("./modules/admin/consultants/consultants.module").then((m) => m.ConsultantsModule),
      },
      {
        path: "minha-conta",
        data: {
          title: "Minha Conta",
        },
        loadChildren: () => import("./modules/settings/settings.module").then((m) => m.SettingsModule),
      },
      {
        path: "cursos",
        canMatch: [RoleGuard],
        data: {
          title: "Cursos",
          menuKey: "COURSES",
        },
        loadChildren: () => import("./modules/admin/courses/courses.module").then((m) => m.CoursesModule),
      },
    ],
  },
];
