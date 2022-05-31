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
  interesPersonales18: number;
  interesPersonales24: number;
  interesPersonales36: number;
  interesPrendarios12: number;
  interesPrendarios18: number;
  interesPrendarios24: number;
  interesPrendarios36: number;
  showTope = false;
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
      interesPersonales18,
      interesPersonales24,
      interesPersonales36,
      interesPrendarios12,
      interesPrendarios18,
      interesPrendarios24,
      interesPrendarios36,
      whatsapp,
    } = await this.auth.getValoresSimulador();
    this.interesGastos = interesGastos;
    this.interesPersonales12 = interesPersonales12;
    this.interesPersonales18 = interesPersonales18;
    this.interesPersonales24 = interesPersonales24;
    this.interesPersonales36 = interesPersonales36;
    this.interesPrendarios12 = interesPrendarios12;
    this.interesPrendarios18 = interesPrendarios18;
    this.interesPrendarios24 = interesPrendarios24;
    this.interesPrendarios36 = interesPrendarios36;
    this.whatsapp = whatsapp;
  }

  handleCalculate() {
    this.showTope = false;
    this.total = 0;

    const { pedir, creditType, duesCount } = this.simulatorForm.value;
    if (pedir < 5000)
      return this.alert.error(
        'Por favor ingrese un monto válido (Mayor a $5.000)'
      );
    if (creditType == 'personal' && pedir > 400_000)
      return (this.showTope = true);
    if (creditType == 'prendario' && pedir > 1_500_000)
      return (this.showTope = true);
    // COMISION
    const precioConComision = this.calculateComision(pedir);
    // INTERESES
    const precioConInteres = this.calculateInteres(
      creditType,
      duesCount,
      precioConComision
    );
    // DIVIDO POR CUOTAS
    this.total = precioConInteres / duesCount;
  }

  calculateComision(pedir: number) {
    return pedir + (pedir * this.interesGastos) / 100;
  }

  calculateInteres(
    creditType: string,
    duesCount: number,
    precioConComision: number
  ) {
    let precioConInteres = 0;
    if (creditType == 'personal') {
      if (duesCount <= 12)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPersonales12 * 12)) / 100;
      else if (duesCount <= 18)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPersonales18 * 18)) / 100;
      else if (duesCount <= 24)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPersonales24 * 24)) / 100;
      else if (duesCount <= 36)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPersonales36 * 36)) / 100;
    }
    if (creditType == 'prendario') {
      if (duesCount <= 12)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPrendarios12 * 12)) / 100;
      else if (duesCount <= 18)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPrendarios18 * 18)) / 100;
      else if (duesCount <= 24)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPrendarios24 * 24)) / 100;
      else if (duesCount <= 36)
        precioConInteres =
          precioConComision +
          (precioConComision * (this.interesPrendarios36 * 36)) / 100;
    }
    return precioConInteres;
  }
}
