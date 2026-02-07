import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MedicamentoFormComponent } from './componentes/medicamento-form/medicamento-form.component';
import { TerapiasComponent } from "./componentes/terapias/terapias.component";

const routes: Routes = [
  {
    path: '',
    component: MedicamentoFormComponent
  },
  {
    path: 'terapias',
    component: TerapiasComponent
  },
  {
    path: 'tratamento/:id',
    loadComponent: () => import('./componentes/visualizar-tratamento/visualizar-tratamento.component').then(m => m.VisualizarTratamentoComponent)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
