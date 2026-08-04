import { HttpInterceptorFn } from "@angular/common/http";
import { tap } from "rxjs";
import { catchError } from "rxjs";
import { throwError } from "rxjs";

export const httpInterceptor: HttpInterceptorFn = (req, next) =>{
    console.log('Inteceptando Requisição: ', req.url);
    // aqui você pode add logica para modificar a requisição       
    const token = 'fake-token-jwt';
    const novaReq = req.clone({
        setHeaders: {
            authorization: `Bearer ${token}`,
        },
    });
   return next(novaReq).pipe(
    tap({
        next: (event) => console.log('Response: ',event),
        error: (error) => console.error('Erro de requisição: ', error)
    }),
     catchError((error) => {
      console.error('Erro de requisição global:', error);

      if (error.status === 401) {
        console.warn('Usuário não autorizado!');
      }

      if (error.status === 500) {
        console.warn('Erro interno do servidor!');
      }

      return throwError(() => error);
    })
   );
};