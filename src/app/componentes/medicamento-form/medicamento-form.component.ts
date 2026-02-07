import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-medicamento-form',
    templateUrl: './medicamento-form.component.html',
    styleUrls: ['./medicamento-form.component.scss'],
    standalone: false
})
export class MedicamentoFormComponent implements OnInit {
    medicamentoForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        const dataAtual = new Date().toISOString();

        this.medicamentoForm = this.formBuilder.group({
            medicamento: ['', Validators.required],
            quantidade: ['', Validators.required],
            tipoMedicamento: [''],
            frequencia: ['', Validators.required],
            duracao: ['', Validators.required],
            inicioTerapia: [dataAtual, Validators.required]
        });
    }

    async salvarMedicamento() {
        if (this.medicamentoForm.valid) {
            const form = this.medicamentoForm.value;
            const horarios = this.calcularHorarios(new Date(form.inicioTerapia), form.frequencia, form.duracao);

            // Agendar notificações para cada horário
            // Usando um ID base aleatório para este grupo de medicamentos (em app real, usar ID do banco)
            const baseId = Math.floor(Math.random() * 1000000);

            for (let i = 0; i < horarios.length; i++) {
                await this.notificationService.agendarNotificacao(
                    baseId + i,
                    `Hora do Remédio: ${form.medicamento}`,
                    `Tome ${form.quantidade} ${form.tipoMedicamento || ''}`,
                    horarios[i]
                );
            }

            console.log('Medicamento salvo e notificações agendadas:', form);
            this.medicamentoForm.reset();
            this.navCtrl.navigateBack('/terapias');
        }
    }

    private calcularHorarios(inicio: Date, frequencia: string, duracao: string): Date[] {
        const horarios: Date[] = [];
        let intervaloHoras = 24;

        if (frequencia === 'a cada 12 horas') intervaloHoras = 12;
        else if (frequencia === 'a cada 8 horas') intervaloHoras = 8;
        else if (frequencia === 'a cada 4 horas') intervaloHoras = 4;
        else if (frequencia === 'a cada 3 horas') intervaloHoras = 3;

        let totalDias = 1;
        if (duracao.includes('semana')) {
            const semanas = parseInt(duracao.split(' ')[0]);
            totalDias = semanas * 7;
        } else if (duracao.includes('mês') || duracao.includes('meses')) {
            const meses = parseInt(duracao.split(' ')[0]);
            totalDias = meses * 30;
        } else {
            totalDias = parseInt(duracao.split(' ')[0]);
        }

        const dataFim = new Date(inicio);
        dataFim.setDate(dataFim.getDate() + totalDias);

        let dataAtual = new Date(inicio);
        while (dataAtual < dataFim) {
            horarios.push(new Date(dataAtual));
            dataAtual.setHours(dataAtual.getHours() + intervaloHoras);
        }

        return horarios;
    }
}