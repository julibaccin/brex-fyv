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
  interesGastos = 14;
  interesPersonales12 = 33.6;
  interesPersonales36 = 48;
  interesPrendarios12 = 33.6;
  interesPrendarios36 = 42;
  simulatorForm: FormGroup = this.formBuilder.group({
    creditType: ['personal', [Validators.required]],
    duesCount: [1, [Validators.required]],
    pedir: [0],
  });

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alert: AlertsService
  ) {}

  ngOnInit(): void {}

  handleCalculate() {
    const { pedir, creditType, duesCount } = this.simulatorForm.value;
    if (pedir <= 0)
      return this.alert.error('Por favor ingrese un monto válido');

    // COMISION
    const precioConComision = this.calculateComision(pedir);

    // INTERESES
    const precioConInteres =
      creditType == 'personal' && duesCount <= 12
        ? precioConComision +
          (precioConComision * this.interesPersonales12) / 100
        : creditType == 'personal' && duesCount > 12
        ? precioConComision +
          (precioConComision * this.interesPersonales36) / 100
        : creditType == 'prendario' && duesCount > 12
        ? precioConComision +
          (precioConComision * this.interesPrendarios12) / 100
        : creditType == 'prendario' && duesCount > 12
        ? precioConComision +
          (precioConComision * this.interesPrendarios36) / 100
        : 0;

    // DIVIDO POR CUOTAS
    this.total = precioConInteres / duesCount;
  }

  calculateComision(pedir: number) {
    return pedir + (pedir * this.interesGastos) / 100;
  }
}
