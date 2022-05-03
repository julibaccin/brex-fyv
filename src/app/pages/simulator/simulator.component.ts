import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
})
export class SimulatorComponent implements OnInit {
  total = 0;
  interesGastos: number;
  interesPersonales12: number;
  interesPersonales36: number;
  interesPrendarios12: number;
  interesPrendarios36: number;
  whatsapp: string;
  simulatorForm: FormGroup = this.formBuilder.group({
    creditType: ['personal', [Validators.required]],
    duesCount: [12, [Validators.required]],
    pedir: [0],
  });

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private alert: AlertsService
  ) {}

  async ngOnInit(): Promise<void> {
    const {
      interesGastos,
      interesPersonales12,
      interesPersonales36,
      interesPrendarios12,
      interesPrendarios36,
      whatsapp,
    } = await this.auth.getValoresSimulador();
    this.interesGastos = interesGastos;
    this.interesPersonales12 = interesPersonales12;
    this.interesPersonales36 = interesPersonales36;
    this.interesPrendarios12 = interesPrendarios12;
    this.interesPrendarios36 = interesPrendarios36;
    this.whatsapp = whatsapp;
  }

  handleCalculate() {
    const { pedir, creditType, duesCount } = this.simulatorForm.value;
    if (pedir < 5000)
      return this.alert.error(
        'Por favor ingrese un monto válido (Mayor a $5000)'
      );
    // COMISION
    const precioConComision = this.calculateComision(pedir);
    // INTERESES
    const precioConInteres =
      creditType == 'personal' && duesCount <= 12
        ? precioConComision +
          (precioConComision * (this.interesPersonales12 * 12)) / 100
        : creditType == 'personal' && duesCount > 12
        ? precioConComision +
          (precioConComision * (this.interesPersonales36 * 12)) / 100
        : creditType == 'prendario' && duesCount > 12
        ? precioConComision +
          (precioConComision * (this.interesPrendarios12 * 12)) / 100
        : creditType == 'prendario' && duesCount > 12
        ? precioConComision +
          (precioConComision * (this.interesPrendarios36 * 12)) / 100
        : 0;

    // DIVIDO POR CUOTAS
    this.total = precioConInteres / duesCount;
  }

  calculateComision(pedir: number) {
    return pedir + (pedir * this.interesGastos) / 100;
  }
}
