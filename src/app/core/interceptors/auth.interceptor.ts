import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('auth_user');

  if (!storedUser) {
    return next(req);
  }

  try {
    const token = JSON.parse(storedUser).token;
    if (!token) {
      return next(req);
    }

    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  } catch {
    return next(req);
  }
};
