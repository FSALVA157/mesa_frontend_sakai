import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientosTramiteService } from 'src/app/service/movimientos-tramite.service';
import { SectoresService } from 'src/app/service/sectores.service';
import { TiposTramiteService } from 'src/app/service/tipos-tramite.service';
import { TramitesService } from 'src/app/service/tramites.service';
import Swal from 'sweetalert2';
import { globalConstants } from '../../common/global-constants';

@Component({
  selector: 'app-tramites-pendientes',
  templateUrl: './tramites-pendientes.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [
  ]
})
export class TramitesPendientesComponent implements OnInit {

  submitted: boolean;

  //para mensajes
  msgs: Message[] = [];
 
  //representatives: Representative[];
  statuses: any[];

  activityValues: number[] = [0, 100];
  idFrozen: boolean = false;

  loading:boolean = true;

  expandedRows = {};
  isExpanded: boolean = false;

  @ViewChild('dt') table: Table;

  @ViewChild('filter') filter: ElementRef;    

  //FORMULARIOS
  formaMovimientosTramite: FormGroup;

  //VARIABLES MOVIMIENTOS    
  movimientoTramite: MovimientoTramiteModel;  
  movimientoTramiteRecibir: MovimientoTramiteModel;
  tramiteRecibirDialog: boolean;
  
  //LISTAS    
  //listaTramites: TramiteModel[]=[];
  listSectores: SectorModel[]=[];
  listOrganismos: OrganismoModel[]= [];
  listTiposTramite: TipoTramiteModel[]=[];
  listMovimientosTramite: MovimientoTramiteModel[]=[];

  constructor(
    private serviceMensajes: MessageService,
    private tramitesService: TramitesService,
    private movimientosTramiteService: MovimientosTramiteService,
    private sectoresService: SectoresService,
    private tiposTramiteService: TiposTramiteService,
    private fb: FormBuilder
  ) { 
    //FORMULARIO MOVIMIENTOS    
    this.formaMovimientosTramite = this.fb.group({
      tramite_numero: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      num_movimiento_tramite: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      organismo_id: [globalConstants.organismo_usuario,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      sector_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      fojas: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      descripcion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
     
  });
  //FIN FORMULARIO MOVIMIENTOS

  }

  //FIN CONSTRUCTOR......................................................

  ngOnInit(): void {
    this.listarTramitesPendientes(globalConstants.sector_usuario);

  }
  
  
  //RECIBIR TRAMITE
  submitFormRecibirTramite(){
    // if(this.formaTramites.invalid){                        
    //     this.msgs = [];
    //     this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
    //     this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
    //     // Swal.fire(
            
    //     //     {target: document.getElementById('form-modal')},
    //     //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
    //     //     );
    //     return Object.values(this.formaTramites.controls).forEach(control => control.markAsTouched());
    // }

    let dataMovimientoTramite: Partial <MovimientoTramiteModel>;
    dataMovimientoTramite = {
        tramite_numero: parseInt(this.formaMovimientosTramite.get('tramite_numero')?.value),
        sector_origen_id: this.movimientoTramiteRecibir.sector_id,                    
        fojas_ingreso: parseInt(this.formaMovimientosTramite.get('fojas')?.value),
        descripcion_ingreso: this.formaMovimientosTramite.get('descripcion')?.value,
        usuario_id: globalConstants.id_usuario,
        sector_id: globalConstants.sector_usuario
        
    }
    //GUARDAR MOVIMIENTO
    this.movimientosTramiteService.recibirMovimientoTramite(dataMovimientoTramite, parseInt(this.formaMovimientosTramite.get('num_movimiento_tramite')?.value))
        .subscribe(resMovimiento => {
            this.hideDialogRecibir();
            Swal.fire('Exito',`El Tramite fue recibido con Exito`,"success");
            this.listarTramitesPendientes(globalConstants.sector_usuario);
        })
    //FIN GUARDAR MOVIMIENTO

} 
//FIN RECIBIR TRAMITE

  //LISTADO MOVIMIENTOS DE TRAMITE
  listarTramitesPendientes(id_sector: number){ 
    this.expandedRows={};
    if(id_sector){
      this.movimientosTramiteService.listarTramitesPendientes(id_sector).
      subscribe(respuesta => {
        this.listMovimientosTramite= respuesta[0];  
        this.loading = false;           
      //this.expandedRows[tramite.numero_tramite]=true;
      });
    }     
  }
  //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................

  //MANEJO DE FORMULARIO RECIBIR DIALOG
  openDialogRecibir(movimiento: MovimientoTramiteModel) {
    //this.movimientoTramite = {};
    this.movimientoTramiteRecibir = movimiento;
    this.submitted = false;
    this.tramiteRecibirDialog = true;
    this.formaMovimientosTramite.get('tramite_numero')?.setValue(movimiento.tramite_numero);               
    this.formaMovimientosTramite.get('num_movimiento_tramite')?.setValue(movimiento.num_movimiento_tramite);
    // this.formaMovimientosTramite.get('organismo_id')?.setValue(movimiento.sector.organismo_id);
    // this.formaMovimientosTramite.get('sector_id')?.setValue(movimiento.sector_id);
    this.formaMovimientosTramite.get('fojas')?.setValue(movimiento.fojas_salida);
  
      //this.nuevoTramite=true;
  }
  
  hideDialogRecibir() {
    this.movimientoTramiteRecibir={};
    this.tramiteRecibirDialog = false;
    this.submitted = false;
    //this.nuevoTramite=false;
  }    
  //FIN MANEJO FORMULARIO RECIBIR DIALOG....................................

}
