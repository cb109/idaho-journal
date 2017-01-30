import { Routes, RouterModule} from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { WriteComponent } from './write/write.component';
import { ReadComponent } from './read/read.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
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
    component: WriteComponent,
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