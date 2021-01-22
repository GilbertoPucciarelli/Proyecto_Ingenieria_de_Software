import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'local/:nombre',
        children: [
          {
            path: '',
            loadChildren: '../local/local.module#LocalPageModule'
          }
        ]
      },
      {
        path: 'fav',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ]
      },
      {
        path: 'reserva',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: '../login/login.module#LoginPageModule'
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        path: 'resenas/:nombre',
        children: [
          {
            path: '',
            loadChildren: '../resenas/resenas.module#ResenasPageModule'
          }
        ]
      },      {
        path: 'mensajes/:nombre',
        children: [
          {
            path: '',
            loadChildren: '../mensajes/mensajes.module#MensajesPageModule'
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'worker',
        children: [
          {
            path: '',
            loadChildren: '../worker/worker.module#WorkerPageModule'
          }
        ]
      },
      {
        path: 'reservaciones',
        children: [
          {
            path: '',
            loadChildren: '../reservaciones/reservaciones.module#ReservacionesPageModule'
          }
        ]
      },
      {
        path: 'conversaciones',
        children: [
          {
            path: '',
            loadChildren: '../conversaciones/conversaciones.module#ConversacionesPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }