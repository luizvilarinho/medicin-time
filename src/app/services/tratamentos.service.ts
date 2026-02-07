import { Injectable } from '@angular/core';

export interface Tratamento {
    id: number;
    medicamento: string;
    frequencia: string; // descrição amigável
    frequenciaHoras: number; // intervalo em horas (ex: 8, 12)
    duracaoDias: number;
    concluido?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TratamentosService {

    private tratamentos: Tratamento[] = [
        {
            id: 1,
            medicamento: 'Dipirona 500mg',
            frequencia: 'A cada 6 horas',
            frequenciaHoras: 6,
            duracaoDias: 3,
            concluido: false
        },
        {
            id: 2,
            medicamento: 'Amoxicilina 875mg',
            frequencia: 'A cada 12 horas',
            frequenciaHoras: 12,
            duracaoDias: 7,
            concluido: false
        }
    ];

    constructor() { }

    getTratamentos(): Tratamento[] {
        return this.tratamentos;
    }

    getTratamento(id: number): Tratamento | undefined {
        return this.tratamentos.find(t => t.id === id);
    }

    deleteTratamento(id: number): void {
        this.tratamentos = this.tratamentos.filter(t => t.id !== id);
    }
}
