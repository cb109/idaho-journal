import { Routes, RouterModule} from '@angular/router';

import { LoginComponent } from './login/login.component';
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