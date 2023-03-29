import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region:   ['', Validators.required],
    pais:     ['', Validators.required],
    frontera: ['', Validators.required],
  })

  //llenar Selectores
  regiones: string[]  = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;


  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) {}


  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(( _ ) => {
          this.miFormulario.get('pais')?.reset(''),
          this.cargando = true;
        }),
        switchMap(region =>  this.paisesService.getPaisesPorRegion(region)),
      )
       .subscribe(paises => {
      //  console.log(paises);
       this.paises = paises;
       this.cargando = false;
        }) 
 

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(( _ ) => { this.miFormulario.get('frontera')?.reset(''),
      this.cargando = true;
    }),

      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap( pais => this.paisesService.getPaisesPorCodigos( pais ? pais![0]?.borders : [] ) )
    )
    .subscribe(paises => {
      if(paises !== null ) {
        if(paises.length > 0) {
          this.fronteras = paises;
        }
        this.cargando = false;
      }  
    })
    
  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
