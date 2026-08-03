import type {
  LocationQueryRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router
} from 'vue-router';
import type { RouteKey, RoutePath } from '@elegant-router/types';
import { useAuthStore } from '@/store/modules/auth';
import { useRouteStore } from '@/store/modules/route';
import { localStg } from '@/utils/storage';
import { getRouteName } from '@/router/elegant/transform';

/**
 * create route guard
 *
 * @param router router instance
 */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const location = await initRoute(to);

    if (location) {
      next(location);
      return;
    }

    const authStore = useAuthStore();

    const rootRoute: RouteKey = 'root';
    const loginRoute: RouteKey = 'login';
    const noAuthorizationRoute: RouteKey = '403';

    const isLogin = Boolean(localStg.get('token')) || authStore.isLogin;
    const needLogin = !to.meta.constant;
    const routeRoles = to.meta.roles || [];

    const hasAuth = authStore.isStaticSuper || !routeRoles.length;

    // handle login route access
    if (to.name === loginRoute) {
      handleLoginRouteAccess(to, next, isLogin, rootRoute);
      return;
    }

    // if the route does not need login, then it is allowed to access directly
    if (!needLogin) {
      handleRouteSwitch(to, from, next);
      return;
    }

    // the route need login but the user is not logged in, then switch to the login page
    if (!isLogin) {
      handleLoginRedirect(to, next);
      return;
    }

    // if the user is logged in but does not have authorization, then switch to the 403 page
    if (!hasAuth) {
      next({ name: noAuthorizationRoute });
      return;
    }

    // switch route normally
    handleRouteSwitch(to, from, next);
  });
}

/**
 * initialize route
 *
 * @param to to route
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const routeStore = useRouteStore();
  const authStore = useAuthStore();

  const notFoundRoute: RouteKey = 'not-found';
  const isNotFoundRoute = to.name === notFoundRoute;

  // if the constant route is not initialized, then initialize the constant route
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute();

    // the route is captured by the "not-found" route because the constant route is not initialized
    // after the constant route is initialized, redirect to the original route
    const path = to.fullPath;
    const location: RouteLocationRaw = {
      path,
      replace: true,
      query: to.query,
      hash: to.hash
    };

    return location;
  }

  const loginRoute: RouteKey = 'login';
  let isLogin = Boolean(localStg.get('token')) || authStore.isLogin;

  if (!isLogin && to.name !== loginRoute) {
    await authStore.initUserInfo();
    isLogin = Boolean(localStg.get('token')) || authStore.isLogin;
  }

  if (!isLogin) {
    const isHomeRoute = routeStore.routeHome === to.name;
    // if the user is not logged in and the route is a constant route but not the "not-found" route, then it is allowed to access.
    if (to.meta.constant && !isNotFoundRoute && !isHomeRoute) {
      routeStore.onRouteSwitchWhenNotLoggedIn();

      return null;
    }

    // if the user is not logged in, then switch to the login page
    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome);

    const location: RouteLocationRaw = getLoginLocation(query);

    return location;
  }

  if (!routeStore.isInitAuthRoute) {
    // initialize the auth route
    await routeStore.initAuthRoute();

    // the route is captured by the "not-found" route because the auth route is not initialized
    // after the auth route is initialized, redirect to the original route
    if (isNotFoundRoute) {
      const rootRoute: RouteKey = 'root';
      const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath;

      const location: RouteLocationRaw = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash
      };

      return location;
    }
  }

  routeStore.onRouteSwitchWhenLoggedIn();

  // the auth route is initialized
  // it is not the "not-found" route, then it is allowed to access
  if (!isNotFoundRoute) {
    return null;
  }

  // it is captured by the "not-found" route, then check whether the route exists
  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);
  const noPermissionRoute: RouteKey = '403';

  if (exist) {
    const location: RouteLocationRaw = {
      name: noPermissionRoute
    };

    return location;
  }

  return null;
}

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // route with href
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    next({ path: from.fullPath, replace: true, query: from.query, hash: from.hash });

    return;
  }

  next();
}

function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  const loginRoute: RouteKey = 'login';
  const redirect = to.fullPath;
  const [redirectPath, redirectQuery] = redirect.split('?');
  const redirectName = getRouteName(redirectPath as RoutePath);

  const isRedirectHome = routeHome === redirectName;

  const query: LocationQueryRaw = to.name !== loginRoute && !isRedirectHome ? { redirect } : {};

  if (isRedirectHome && redirectQuery) {
    query.redirect = `/?${redirectQuery}`;
  }

  return query;
}

/**
 * handle login route access based on environment variable and login status
 *
 * @param to target route
 * @param next navigation guard next function
 * @param isLogin whether user is logged in
 * @param rootRoute root route key
 */
function handleLoginRouteAccess(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  isLogin: boolean,
  rootRoute: RouteKey
) {
  const { VITE_GFS_PORTAL_URL } = import.meta.env;

  // if external portal is configured, redirect to external portal regardless of login status
  if (VITE_GFS_PORTAL_URL) {
    window.location.href = VITE_GFS_PORTAL_URL;
    return;
  }

  // if using internal login and user is already logged in, redirect to appropriate page
  if (isLogin) {
    const redirect = to.query?.redirect as string;
    if (redirect) {
      next({ path: redirect });
    } else {
      next({ name: rootRoute });
    }
    return;
  }

  // if using internal login and user is not logged in, allow access to login page
  next();
}

/**
 * handle login redirect based on environment variable
 *
 * @param to target route
 * @param next navigation guard next function
 */
function handleLoginRedirect(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const { VITE_GFS_PORTAL_URL } = import.meta.env;

  if (VITE_GFS_PORTAL_URL) {
    // redirect to external portal login
    window.location.href = VITE_GFS_PORTAL_URL;
    return;
  }

  // redirect to internal login route
  const loginRoute: RouteKey = 'login';
  next({ name: loginRoute, query: { redirect: to.fullPath } });
}

/**
 * get login location based on environment variable
 *
 * @param query route query parameters
 */
function getLoginLocation(query: LocationQueryRaw): RouteLocationRaw {
  const { VITE_GFS_PORTAL_URL } = import.meta.env;

  if (VITE_GFS_PORTAL_URL) {
    // for external portal, we still return internal login route
    // the actual redirect will be handled by handleLoginRedirect
    const loginRoute: RouteKey = 'login';
    return {
      name: loginRoute,
      query
    };
  }

  // internal login route
  const loginRoute: RouteKey = 'login';
  return {
    name: loginRoute,
    query
  };
}
