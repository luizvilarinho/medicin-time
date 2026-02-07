import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TratamentosService, Tratamento } from '../../services/tratamentos.service';
import { addIcons } from 'ionicons';
import { trash, checkmarkCircle, medkit, time, checkmark } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-terapias',
  templateUrl: 'terapias.component.html',
  styleUrls: ['terapias.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TerapiasComponent implements OnInit {
  tratamentos: Tratamento[] = [];
  dosesTomadas: number = 0;
  totalDoses: number = 0;
  progresso: number = 0;

  constructor(
    private tratamentosService: TratamentosService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({ trash, checkmarkCircle, medkit, time, checkmark });
  }

  ngOnInit() {
    this.carregarTratamentos();
  }

  ionViewWillEnter() {
    this.carregarTratamentos();
  }

  carregarTratamentos() {
    this.tratamentos = this.tratamentosService.getTratamentos();
    this.calcularProgresso();
  }

  calcularProgresso() {
    this.totalDoses = this.tratamentos.length;
    this.dosesTomadas = this.tratamentos.filter(t => t.concluido).length;
    this.progresso = this.totalDoses > 0 ? this.dosesTomadas / this.totalDoses : 0;
  }

  abrirDetalhes(id: number) {
    this.router.navigate(['/tratamento', id]);
  }

  async excluirTratamento(event: Event, id: number) {
    event.stopPropagation();

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

  async concluirTratamento(event: Event, tratamento: Tratamento) {
    event.stopPropagation();

    // Toggle status
    tratamento.concluido = !tratamento.concluido;

    // Haptic feedback only on completion
    if (tratamento.concluido) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }

    this.calcularProgresso();
    // Here we would call the service to save the change
  }
}
