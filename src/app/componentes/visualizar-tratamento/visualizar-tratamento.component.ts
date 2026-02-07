import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TratamentosService, Tratamento } from '../../services/tratamentos.service';

interface Dose {
    hora: string;
    tomado: boolean;
}

interface DiaTratamento {
    titulo: string;
    doses: Dose[];
}

@Component({
    selector: 'app-visualizar-tratamento',
    templateUrl: './visualizar-tratamento.component.html',
    styleUrls: ['./visualizar-tratamento.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class VisualizarTratamentoComponent implements OnInit {

    tratamento: Tratamento | undefined;
    diasTratamento: DiaTratamento[] = [];

    constructor(
        private route: ActivatedRoute,
        private tratamentosService: TratamentosService
    ) { }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.tratamento = this.tratamentosService.getTratamento(id);

        if (this.tratamento) {
            this.gerarDiasTratamento();
        }
    }

    gerarDiasTratamento() {
        if (!this.tratamento) return;

        const horasNoDia = 24;
        const dosesPorDia = horasNoDia / this.tratamento.frequenciaHoras;

        for (let i = 1; i <= this.tratamento.duracaoDias; i++) {
            const doses: Dose[] = [];
            for (let j = 0; j < dosesPorDia; j++) {
                // Simplificação: começa as 8h da manhã do dia 1
                const horaBase = 8;
                const horaCalculada = (horaBase + (j * this.tratamento.frequenciaHoras)) % 24;
                doses.push({
                    hora: `${horaCalculada}:00`,
                    tomado: false
                });
            }
            this.diasTratamento.push({
                titulo: `Dia ${i}`,
                doses: doses
            });
        }
    }
}
