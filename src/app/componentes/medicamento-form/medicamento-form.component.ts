import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-medicamento-form',
    templateUrl: './medicamento-form.component.html',
    styleUrls: ['./medicamento-form.component.scss'],
    standalone: false
})
export class MedicamentoFormComponent implements OnInit {
    medicamentoForm!: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        // Criar uma data atual no formato ISO 8601
        const dataAtual = new Date().toISOString();

        this.medicamentoForm = this.formBuilder.group({
            medicamento: ['', Validators.required],
            quantidade: ['', Validators.required],
            tipoMedicamento: [''],
            frequencia: ['', Validators.required],
            duracao: ['', Validators.required],
            inicioTerapia: [dataAtual, Validators.required] // Inicializa com a data atual
        });
    }

    salvarMedicamento() {
        if (this.medicamentoForm.valid) {
            console.log('Medicamento salvo:', this.medicamentoForm.value);
            // Aqui você pode implementar a lógica para salvar o medicamento
            this.medicamentoForm.reset();
        }
    }
}