import { Routes, RouterModule} from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { LoginComponent } from './login/login.component';
import { WriteComponent } from './write/write.component';
import { ImageComponent } from './image/image.component';
import { ReadComponent } from './read/read.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'write/text',
    component: WriteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'write/audio',
    component: WriteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'write/image',
    component: ImageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'read',
    component: ReadComponent,
    canActivate: [AuthGuardService],
  },
  // Fallback routes:
  {
    path: '',
    redirectTo: '/write/text',
    pathMatch: 'full'
  },
  {
    path: "**",
    redirectTo: '/write/text',
  }

];

export const routing = RouterModule.forRoot(appRoutes);
export const routedComponents = [
  LoginComponent,
  WriteComponent,
  ReadComponent,
];