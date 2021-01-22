import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'local/:nombre', loadChildren: './local/local.module#LocalPageModule' },
  { path: 'worker', loadChildren: './worker/worker.module#WorkerPageModule' },
  { path: 'resenas/:nombre', loadChildren: './resenas/resenas.module#ResenasPageModule' },
  { path: 'conversaciones', loadChildren: './conversaciones/conversaciones.module#ConversacionesPageModule' },
  { path: 'reservaciones', loadChildren: './reservaciones/reservaciones.module#ReservacionesPageModule' },
  { path: 'mensajes/:nombre', loadChildren: './mensajes/mensajes.module#MensajesPageModule' },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
