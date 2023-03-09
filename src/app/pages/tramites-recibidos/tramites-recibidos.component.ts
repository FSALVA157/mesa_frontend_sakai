import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { organismos, sectores } from 'src/app/common/data-mockeada';
import { globalConstants } from 'src/app/common/global-constants';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientosTramiteService } from 'src/app/service/movimientos-tramite.service';
import { SectoresService } from 'src/app/service/sectores.service';
import Swal from 'sweetalert2';
import { FuncionesPersonalizadasService } from '../../service/funciones-personalizadas.service';

@Component({
  selector: 'app-tramites-recibidos',
  templateUrl: './tramites-recibidos.component.html',    
  styleUrls: ['../../../assets/demo/badges.scss'],
  providers: [MessageService, ConfirmationService],
  styles: [
  ]
})
export class TramitesRecibidosComponent implements OnInit {
  //TEMPORAL
  sector: SectorModel;

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
  movimientoTramiteEnviar: MovimientoTramiteModel;
  tramiteSalidaDialog: boolean;
  enviarTramite: boolean = false;
  
  //LISTAS    
  //listaTramites: TramiteModel[]=[];
  listSectores: SectorModel[]=[];
  listOrganismos: OrganismoModel[]= [];
  listTiposTramite: TipoTramiteModel[]=[];
  listMovimientosTramite: MovimientoTramiteModel[]=[];


  constructor(
    private movimientosTramiteService: MovimientosTramiteService,
    private sectoresService: SectoresService,
    private funcionesPersonalizadasService: FuncionesPersonalizadasService,
    private fb: FormBuilder

  ) { 
    this.sector = globalConstants.sector;
    
    //FORMULARIO MOVIMIENTOS    
    this.formaMovimientosTramite = this.fb.group({
      tramite_numero: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      num_movimiento_tramite: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      organismo_id: [globalConstants.sector.organismo_id,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      sector_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      fojas: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
      descripcion: [,[Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
     
  });
  //FIN FORMULARIO MOVIMIENTOS
  }

  ngOnInit(): void {
    this.listarTramitesRecibidos(globalConstants.sector.id_sector);
    this.cargarSectores(globalConstants.sector.organismo_id);
    this.listOrganismos = organismos;
  }

  //MANEJO DE FORMULARIO SALIDA DIALOG
  autorizarEnviarTramite(){
    this.enviarTramite= true;
  }

  openDialogSalida(movimiento: MovimientoTramiteModel) {
    this.movimientoTramiteEnviar = {};
    this.movimientoTramiteEnviar = movimiento;
    this.submitted = false;
    this.tramiteSalidaDialog = true;
    this.formaMovimientosTramite.get('tramite_numero')?.setValue(movimiento.tramite_numero);               
    this.formaMovimientosTramite.get('num_movimiento_tramite')?.setValue(movimiento.num_movimiento_tramite);  
    this.formaMovimientosTramite.get('fojas')?.setValue(movimiento.fojas_ingreso);
  }
  
  hideDialogSalida() {
    this.movimientoTramiteEnviar = {};
      this.tramiteSalidaDialog = false;
      this.enviarTramite= false;
      this.submitted = false;
      this.msgs = [];
  }    
  //FIN MANEJO FORMULARIO SALIDA DIALOG....................................

  //GUARDAR SALIDA TRAMITE  
  submitFormSalidaTramite(){
    //if(this.formaTramites.invalid){                        
    //    this.msgs = [];
    //    this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
    //    this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
        // Swal.fire(
            
        //     {target: document.getElementById('form-modal')},
        //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
        //     );
    //    return Object.values(this.formaTramites.controls).forEach(control => control.markAsTouched());
    //}
    
    let dataMovimientoTramite: Partial <MovimientoTramiteModel>;
    dataMovimientoTramite = {                     
      tramite_numero: this.movimientoTramiteEnviar.tramite_numero,
      //num_movimiento_tramite: parseInt(this.formaMovimientosTramite.get('num_movimiento_tramite')?.value),
      sector_destino_id: parseInt(this.formaMovimientosTramite.get('sector_id')?.value),                    
      fojas_salida: this.funcionesPersonalizadasService.getCadenaANumero(this.formaMovimientosTramite.get('fojas')?.value),
      descripcion_salida: this.formaMovimientosTramite.get('descripcion')?.value,
      usuario_id: globalConstants.id_usuario,
      sector_id: globalConstants.sector.id_sector
        
    }
    console.log("fojas salidas: ", dataMovimientoTramite.fojas_salida);
    //GUARDAR SALIDA MOVIMIENTO
    this.movimientosTramiteService.salidaMovimientoTramite(parseInt(this.formaMovimientosTramite.get('num_movimiento_tramite')?.value),dataMovimientoTramite)
        .subscribe({
          next: (resultado) => {
            this.hideDialogSalida();
            Swal.fire('Exito',`El Tramite fue enviado con Exito`,"success");
            this.listarTramitesRecibidos(globalConstants.sector.id_sector);
          },
          error: (err) => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error al dar salida al tramite', detail: ` ${err.error.error.message}` });
          }
            
        })
    //FIN GUARDAR SALIDA MOVIMIENTO

  }    
  //FIN GUARDAR SALIDA TRAMITE............................................................................


  //LISTADO MOVIMIENTOS DE TRAMITE
  listarTramitesRecibidos(id_sector: number){ 
    this.expandedRows={};
    if(id_sector){
      this.movimientosTramiteService.listarTramitesRecibidos(id_sector).
      subscribe(respuesta => {
        this.listMovimientosTramite= respuesta[0];  
        this.loading = false;           
      //this.expandedRows[tramite.numero_tramite]=true;
      });
    }     
  }
  //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................

  //LISTADO DE SECTORES
  listarSectores(){    
    this.sectoresService.listarSectores().
        subscribe(respuesta => {
        this.listSectores= respuesta   
    
      });
  }
  //FIN LISTADO DE SECTORES.................................................................

  //CARGA DE LISTADOS DROP
  cargarSectores(id_organismo: number){
    let mi_organismo = globalConstants.sector.organismo_id;
    if (id_organismo == mi_organismo){
        this.listSectores=sectores.filter(sector => {      
            return sector.id_sector == 1 || sector.organismo_id == id_organismo;
          });
    }
    else{
        this.listSectores=sectores.filter(sector => {      
            return sector.id_sector == 1 || sector.organismo_id == id_organismo && sector.es_mesa_entrada == true;
          });
    }
    
  }

  onChangeOrganismos(){
      const id = this.formaMovimientosTramite.get('organismo_id')?.value;
      if(id != null){               
          this.cargarSectores(parseInt(id.toString()));
          this.formaMovimientosTramite.get('sector_id')?.setValue(1);               
          this.formaMovimientosTramite.get('sector_id')?.markAsUntouched();
          
      }
  }
  //FIN CARGAR ISTADOS DROP..................................................

   //LIMPIAR
   clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR  




}
