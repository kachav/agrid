import './polifills';

import { AppModule } from './app.module';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


/*
 * Bootstrap our Angular app with a top level NgModule
 */

platformBrowserDynamic()
    .bootstrapModule(AppModule);

/*export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule);
}*/
