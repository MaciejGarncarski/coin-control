/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as NotauthenticatedRouteImport } from './routes/_not_authenticated/route'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedAccountImport } from './routes/_authenticated/account'
import { Route as NotauthenticatedAuthIndexImport } from './routes/_not_authenticated/auth/index'
import { Route as NotauthenticatedAuthRegisterImport } from './routes/_not_authenticated/auth/register'
import { Route as NotauthenticatedAuthPasswordResetImport } from './routes/_not_authenticated/auth/password-reset'
import { Route as NotauthenticatedAuthLoginImport } from './routes/_not_authenticated/auth/login'
import { Route as NotauthenticatedAuthForgotPasswordImport } from './routes/_not_authenticated/auth/forgot-password'

// Create/Update Routes

const NotauthenticatedRouteRoute = NotauthenticatedRouteImport.update({
  id: '/_not_authenticated',
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

const NotauthenticatedAuthIndexRoute = NotauthenticatedAuthIndexImport.update({
  id: '/auth/',
  path: '/auth/',
  getParentRoute: () => NotauthenticatedRouteRoute,
} as any)

const NotauthenticatedAuthRegisterRoute =
  NotauthenticatedAuthRegisterImport.update({
    id: '/auth/register',
    path: '/auth/register',
    getParentRoute: () => NotauthenticatedRouteRoute,
  } as any)

const NotauthenticatedAuthPasswordResetRoute =
  NotauthenticatedAuthPasswordResetImport.update({
    id: '/auth/password-reset',
    path: '/auth/password-reset',
    getParentRoute: () => NotauthenticatedRouteRoute,
  } as any)

const NotauthenticatedAuthLoginRoute = NotauthenticatedAuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => NotauthenticatedRouteRoute,
} as any)

const NotauthenticatedAuthForgotPasswordRoute =
  NotauthenticatedAuthForgotPasswordImport.update({
    id: '/auth/forgot-password',
    path: '/auth/forgot-password',
    getParentRoute: () => NotauthenticatedRouteRoute,
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
    '/_not_authenticated': {
      id: '/_not_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof NotauthenticatedRouteImport
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
    '/_not_authenticated/auth/forgot-password': {
      id: '/_not_authenticated/auth/forgot-password'
      path: '/auth/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof NotauthenticatedAuthForgotPasswordImport
      parentRoute: typeof NotauthenticatedRouteImport
    }
    '/_not_authenticated/auth/login': {
      id: '/_not_authenticated/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof NotauthenticatedAuthLoginImport
      parentRoute: typeof NotauthenticatedRouteImport
    }
    '/_not_authenticated/auth/password-reset': {
      id: '/_not_authenticated/auth/password-reset'
      path: '/auth/password-reset'
      fullPath: '/auth/password-reset'
      preLoaderRoute: typeof NotauthenticatedAuthPasswordResetImport
      parentRoute: typeof NotauthenticatedRouteImport
    }
    '/_not_authenticated/auth/register': {
      id: '/_not_authenticated/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof NotauthenticatedAuthRegisterImport
      parentRoute: typeof NotauthenticatedRouteImport
    }
    '/_not_authenticated/auth/': {
      id: '/_not_authenticated/auth/'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof NotauthenticatedAuthIndexImport
      parentRoute: typeof NotauthenticatedRouteImport
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

interface NotauthenticatedRouteRouteChildren {
  NotauthenticatedAuthForgotPasswordRoute: typeof NotauthenticatedAuthForgotPasswordRoute
  NotauthenticatedAuthLoginRoute: typeof NotauthenticatedAuthLoginRoute
  NotauthenticatedAuthPasswordResetRoute: typeof NotauthenticatedAuthPasswordResetRoute
  NotauthenticatedAuthRegisterRoute: typeof NotauthenticatedAuthRegisterRoute
  NotauthenticatedAuthIndexRoute: typeof NotauthenticatedAuthIndexRoute
}

const NotauthenticatedRouteRouteChildren: NotauthenticatedRouteRouteChildren = {
  NotauthenticatedAuthForgotPasswordRoute:
    NotauthenticatedAuthForgotPasswordRoute,
  NotauthenticatedAuthLoginRoute: NotauthenticatedAuthLoginRoute,
  NotauthenticatedAuthPasswordResetRoute:
    NotauthenticatedAuthPasswordResetRoute,
  NotauthenticatedAuthRegisterRoute: NotauthenticatedAuthRegisterRoute,
  NotauthenticatedAuthIndexRoute: NotauthenticatedAuthIndexRoute,
}

const NotauthenticatedRouteRouteWithChildren =
  NotauthenticatedRouteRoute._addFileChildren(
    NotauthenticatedRouteRouteChildren,
  )

export interface FileRoutesByFullPath {
  '': typeof NotauthenticatedRouteRouteWithChildren
  '/account': typeof AuthenticatedAccountRoute
  '/': typeof AuthenticatedIndexRoute
  '/auth/forgot-password': typeof NotauthenticatedAuthForgotPasswordRoute
  '/auth/login': typeof NotauthenticatedAuthLoginRoute
  '/auth/password-reset': typeof NotauthenticatedAuthPasswordResetRoute
  '/auth/register': typeof NotauthenticatedAuthRegisterRoute
  '/auth': typeof NotauthenticatedAuthIndexRoute
}

export interface FileRoutesByTo {
  '': typeof NotauthenticatedRouteRouteWithChildren
  '/account': typeof AuthenticatedAccountRoute
  '/': typeof AuthenticatedIndexRoute
  '/auth/forgot-password': typeof NotauthenticatedAuthForgotPasswordRoute
  '/auth/login': typeof NotauthenticatedAuthLoginRoute
  '/auth/password-reset': typeof NotauthenticatedAuthPasswordResetRoute
  '/auth/register': typeof NotauthenticatedAuthRegisterRoute
  '/auth': typeof NotauthenticatedAuthIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/_not_authenticated': typeof NotauthenticatedRouteRouteWithChildren
  '/_authenticated/account': typeof AuthenticatedAccountRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_not_authenticated/auth/forgot-password': typeof NotauthenticatedAuthForgotPasswordRoute
  '/_not_authenticated/auth/login': typeof NotauthenticatedAuthLoginRoute
  '/_not_authenticated/auth/password-reset': typeof NotauthenticatedAuthPasswordResetRoute
  '/_not_authenticated/auth/register': typeof NotauthenticatedAuthRegisterRoute
  '/_not_authenticated/auth/': typeof NotauthenticatedAuthIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
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
    | '/_not_authenticated'
    | '/_authenticated/account'
    | '/_authenticated/'
    | '/_not_authenticated/auth/forgot-password'
    | '/_not_authenticated/auth/login'
    | '/_not_authenticated/auth/password-reset'
    | '/_not_authenticated/auth/register'
    | '/_not_authenticated/auth/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  NotauthenticatedRouteRoute: typeof NotauthenticatedRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  NotauthenticatedRouteRoute: NotauthenticatedRouteRouteWithChildren,
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
        "/_not_authenticated"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/account",
        "/_authenticated/"
      ]
    },
    "/_not_authenticated": {
      "filePath": "_not_authenticated/route.tsx",
      "children": [
        "/_not_authenticated/auth/forgot-password",
        "/_not_authenticated/auth/login",
        "/_not_authenticated/auth/password-reset",
        "/_not_authenticated/auth/register",
        "/_not_authenticated/auth/"
      ]
    },
    "/_authenticated/account": {
      "filePath": "_authenticated/account.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_not_authenticated/auth/forgot-password": {
      "filePath": "_not_authenticated/auth/forgot-password.tsx",
      "parent": "/_not_authenticated"
    },
    "/_not_authenticated/auth/login": {
      "filePath": "_not_authenticated/auth/login.tsx",
      "parent": "/_not_authenticated"
    },
    "/_not_authenticated/auth/password-reset": {
      "filePath": "_not_authenticated/auth/password-reset.tsx",
      "parent": "/_not_authenticated"
    },
    "/_not_authenticated/auth/register": {
      "filePath": "_not_authenticated/auth/register.tsx",
      "parent": "/_not_authenticated"
    },
    "/_not_authenticated/auth/": {
      "filePath": "_not_authenticated/auth/index.tsx",
      "parent": "/_not_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
