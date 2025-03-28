/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as CookiePolicyImport } from './routes/cookie-policy'
import { Route as UnauthenticatedRouteImport } from './routes/_unauthenticated/route'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedAccountImport } from './routes/_authenticated/account'
import { Route as UnauthenticatedAuthIndexImport } from './routes/_unauthenticated/auth/index'
import { Route as UnauthenticatedAuthRegisterImport } from './routes/_unauthenticated/auth/register'
import { Route as UnauthenticatedAuthPasswordResetImport } from './routes/_unauthenticated/auth/password-reset'
import { Route as UnauthenticatedAuthLoginImport } from './routes/_unauthenticated/auth/login'
import { Route as UnauthenticatedAuthForgotPasswordImport } from './routes/_unauthenticated/auth/forgot-password'

// Create/Update Routes

const CookiePolicyRoute = CookiePolicyImport.update({
  id: '/cookie-policy',
  path: '/cookie-policy',
  getParentRoute: () => rootRoute,
} as any)

const UnauthenticatedRouteRoute = UnauthenticatedRouteImport.update({
  id: '/_unauthenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedAccountRoute = AuthenticatedAccountImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const UnauthenticatedAuthIndexRoute = UnauthenticatedAuthIndexImport.update({
  id: '/auth/',
  path: '/auth/',
  getParentRoute: () => UnauthenticatedRouteRoute,
} as any)

const UnauthenticatedAuthRegisterRoute =
  UnauthenticatedAuthRegisterImport.update({
    id: '/auth/register',
    path: '/auth/register',
    getParentRoute: () => UnauthenticatedRouteRoute,
  } as any)

const UnauthenticatedAuthPasswordResetRoute =
  UnauthenticatedAuthPasswordResetImport.update({
    id: '/auth/password-reset',
    path: '/auth/password-reset',
    getParentRoute: () => UnauthenticatedRouteRoute,
  } as any)

const UnauthenticatedAuthLoginRoute = UnauthenticatedAuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => UnauthenticatedRouteRoute,
} as any)

const UnauthenticatedAuthForgotPasswordRoute =
  UnauthenticatedAuthForgotPasswordImport.update({
    id: '/auth/forgot-password',
    path: '/auth/forgot-password',
    getParentRoute: () => UnauthenticatedRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/_unauthenticated': {
      id: '/_unauthenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof UnauthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/cookie-policy': {
      id: '/cookie-policy'
      path: '/cookie-policy'
      fullPath: '/cookie-policy'
      preLoaderRoute: typeof CookiePolicyImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/account': {
      id: '/_authenticated/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AuthenticatedAccountImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_unauthenticated/auth/forgot-password': {
      id: '/_unauthenticated/auth/forgot-password'
      path: '/auth/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof UnauthenticatedAuthForgotPasswordImport
      parentRoute: typeof UnauthenticatedRouteImport
    }
    '/_unauthenticated/auth/login': {
      id: '/_unauthenticated/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof UnauthenticatedAuthLoginImport
      parentRoute: typeof UnauthenticatedRouteImport
    }
    '/_unauthenticated/auth/password-reset': {
      id: '/_unauthenticated/auth/password-reset'
      path: '/auth/password-reset'
      fullPath: '/auth/password-reset'
      preLoaderRoute: typeof UnauthenticatedAuthPasswordResetImport
      parentRoute: typeof UnauthenticatedRouteImport
    }
    '/_unauthenticated/auth/register': {
      id: '/_unauthenticated/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof UnauthenticatedAuthRegisterImport
      parentRoute: typeof UnauthenticatedRouteImport
    }
    '/_unauthenticated/auth/': {
      id: '/_unauthenticated/auth/'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof UnauthenticatedAuthIndexImport
      parentRoute: typeof UnauthenticatedRouteImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteRouteChildren {
  AuthenticatedAccountRoute: typeof AuthenticatedAccountRoute
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedAccountRoute: AuthenticatedAccountRoute,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

interface UnauthenticatedRouteRouteChildren {
  UnauthenticatedAuthForgotPasswordRoute: typeof UnauthenticatedAuthForgotPasswordRoute
  UnauthenticatedAuthLoginRoute: typeof UnauthenticatedAuthLoginRoute
  UnauthenticatedAuthPasswordResetRoute: typeof UnauthenticatedAuthPasswordResetRoute
  UnauthenticatedAuthRegisterRoute: typeof UnauthenticatedAuthRegisterRoute
  UnauthenticatedAuthIndexRoute: typeof UnauthenticatedAuthIndexRoute
}

const UnauthenticatedRouteRouteChildren: UnauthenticatedRouteRouteChildren = {
  UnauthenticatedAuthForgotPasswordRoute:
    UnauthenticatedAuthForgotPasswordRoute,
  UnauthenticatedAuthLoginRoute: UnauthenticatedAuthLoginRoute,
  UnauthenticatedAuthPasswordResetRoute: UnauthenticatedAuthPasswordResetRoute,
  UnauthenticatedAuthRegisterRoute: UnauthenticatedAuthRegisterRoute,
  UnauthenticatedAuthIndexRoute: UnauthenticatedAuthIndexRoute,
}

const UnauthenticatedRouteRouteWithChildren =
  UnauthenticatedRouteRoute._addFileChildren(UnauthenticatedRouteRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof UnauthenticatedRouteRouteWithChildren
  '/cookie-policy': typeof CookiePolicyRoute
  '/account': typeof AuthenticatedAccountRoute
  '/': typeof AuthenticatedIndexRoute
  '/auth/forgot-password': typeof UnauthenticatedAuthForgotPasswordRoute
  '/auth/login': typeof UnauthenticatedAuthLoginRoute
  '/auth/password-reset': typeof UnauthenticatedAuthPasswordResetRoute
  '/auth/register': typeof UnauthenticatedAuthRegisterRoute
  '/auth': typeof UnauthenticatedAuthIndexRoute
}

export interface FileRoutesByTo {
  '': typeof UnauthenticatedRouteRouteWithChildren
  '/cookie-policy': typeof CookiePolicyRoute
  '/account': typeof AuthenticatedAccountRoute
  '/': typeof AuthenticatedIndexRoute
  '/auth/forgot-password': typeof UnauthenticatedAuthForgotPasswordRoute
  '/auth/login': typeof UnauthenticatedAuthLoginRoute
  '/auth/password-reset': typeof UnauthenticatedAuthPasswordResetRoute
  '/auth/register': typeof UnauthenticatedAuthRegisterRoute
  '/auth': typeof UnauthenticatedAuthIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/_unauthenticated': typeof UnauthenticatedRouteRouteWithChildren
  '/cookie-policy': typeof CookiePolicyRoute
  '/_authenticated/account': typeof AuthenticatedAccountRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_unauthenticated/auth/forgot-password': typeof UnauthenticatedAuthForgotPasswordRoute
  '/_unauthenticated/auth/login': typeof UnauthenticatedAuthLoginRoute
  '/_unauthenticated/auth/password-reset': typeof UnauthenticatedAuthPasswordResetRoute
  '/_unauthenticated/auth/register': typeof UnauthenticatedAuthRegisterRoute
  '/_unauthenticated/auth/': typeof UnauthenticatedAuthIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/cookie-policy'
    | '/account'
    | '/'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/password-reset'
    | '/auth/register'
    | '/auth'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/cookie-policy'
    | '/account'
    | '/'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/password-reset'
    | '/auth/register'
    | '/auth'
  id:
    | '__root__'
    | '/_authenticated'
    | '/_unauthenticated'
    | '/cookie-policy'
    | '/_authenticated/account'
    | '/_authenticated/'
    | '/_unauthenticated/auth/forgot-password'
    | '/_unauthenticated/auth/login'
    | '/_unauthenticated/auth/password-reset'
    | '/_unauthenticated/auth/register'
    | '/_unauthenticated/auth/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  UnauthenticatedRouteRoute: typeof UnauthenticatedRouteRouteWithChildren
  CookiePolicyRoute: typeof CookiePolicyRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  UnauthenticatedRouteRoute: UnauthenticatedRouteRouteWithChildren,
  CookiePolicyRoute: CookiePolicyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/_unauthenticated",
        "/cookie-policy"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/account",
        "/_authenticated/"
      ]
    },
    "/_unauthenticated": {
      "filePath": "_unauthenticated/route.tsx",
      "children": [
        "/_unauthenticated/auth/forgot-password",
        "/_unauthenticated/auth/login",
        "/_unauthenticated/auth/password-reset",
        "/_unauthenticated/auth/register",
        "/_unauthenticated/auth/"
      ]
    },
    "/cookie-policy": {
      "filePath": "cookie-policy.tsx"
    },
    "/_authenticated/account": {
      "filePath": "_authenticated/account.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_unauthenticated/auth/forgot-password": {
      "filePath": "_unauthenticated/auth/forgot-password.tsx",
      "parent": "/_unauthenticated"
    },
    "/_unauthenticated/auth/login": {
      "filePath": "_unauthenticated/auth/login.tsx",
      "parent": "/_unauthenticated"
    },
    "/_unauthenticated/auth/password-reset": {
      "filePath": "_unauthenticated/auth/password-reset.tsx",
      "parent": "/_unauthenticated"
    },
    "/_unauthenticated/auth/register": {
      "filePath": "_unauthenticated/auth/register.tsx",
      "parent": "/_unauthenticated"
    },
    "/_unauthenticated/auth/": {
      "filePath": "_unauthenticated/auth/index.tsx",
      "parent": "/_unauthenticated"
    }
  }
}
ROUTE_MANIFEST_END */
