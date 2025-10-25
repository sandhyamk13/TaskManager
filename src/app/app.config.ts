import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//import { environment } from '../environments/environment';


import { routes } from './app.routes';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { loadTasksEffect } from './features/tasks/state/task.effects';
import { from } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot({}),
      //EffectsModule.forRoot([loadTasksEffect]),

      //StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
    ),
  ]
};
