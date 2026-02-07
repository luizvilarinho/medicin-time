import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TratamentosService, Tratamento } from '../../services/tratamentos.service';
import { addIcons } from 'ionicons';
import { trash, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-terapias',
  templateUrl: 'terapias.component.html',
  styleUrls: ['terapias.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TerapiasComponent implements OnInit {
  tratamentos: Tratamento[] = [];

  constructor(
    private tratamentosService: TratamentosService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({ trash, checkmarkCircle });
  }

  ngOnInit() {
    this.carregarTratamentos();
  }

  ionViewWillEnter() {
    // Garante que a lista seja atualizada ao voltar da tela de detalhes (se deletou lá)
    // Mas no nosso caso deleta aqui. De qualquer forma é boa prática.
    this.carregarTratamentos();
  }

  carregarTratamentos() {
    this.tratamentos = this.tratamentosService.getTratamentos();
  }

  abrirDetalhes(id: number) {
    this.router.navigate(['/tratamento', id]);
  }

  async excluirTratamento(event: Event, id: number) {
    event.stopPropagation(); // Impede abrir detalhes

    const alert = await this.alertCtrl.create({
      header: 'Excluir Tratamento',
      message: 'Tem certeza que deseja excluir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.tratamentosService.deleteTratamento(id);
            this.carregarTratamentos();
          }
        }
      ]
    });

    await alert.present();
  }

  concluirTratamento(event: Event, tratamento: Tratamento) {
    event.stopPropagation(); // Impede abrir detalhes
    tratamento.concluido = !tratamento.concluido;
    // Aqui chamaria o serviço para salvar a alteração
  }
}
