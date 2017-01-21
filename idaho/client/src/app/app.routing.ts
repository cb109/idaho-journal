import { Routes, RouterModule} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { WriteComponent } from './write/write.component';
import { ReadComponent } from './read/read.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/write/text',
    pathMatch: 'full'
  },
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
    component: WriteComponent
  },
  {
    path: 'write/audio',
    component: WriteComponent
  },
  {
    path: 'write/image',
    component: WriteComponent
  },
  {
    path: 'read',
    component: ReadComponent
  },
];

export const routing = RouterModule.forRoot(appRoutes);
export const routedComponents = [
  LoginComponent,
  WriteComponent,
  ReadComponent,
];