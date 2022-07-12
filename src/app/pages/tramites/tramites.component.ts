
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Customer, Representative } from '../../api/customer';
import { CustomerService } from '../../service/customerservice';
import { Table } from 'primeng/table';
import { Message, MessageService, ConfirmationService } from 'primeng/api'
import { TramiteModel } from '../../models/tramite.model';
import { TramitesService } from '../../service/tramites.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SectoresService } from 'src/app/service/sectores.service';
import { SectorModel } from 'src/app/models/sector.model';
import { TiposTramiteService } from '../../service/tipos-tramite.service';
import { TipoTramiteModel } from 'src/app/models/tipo-tramite.model';
import { MovimientoTramiteModel } from 'src/app/models/movimiento-tramite.model';
import { MovimientosTramiteService } from '../../service/movimientos-tramite.service';
import { OrganismoModel } from '../../models/organismo.model';
import { globalConstants } from '../../common/global-constants';
import { organismos, sectores } from 'src/app/common/data-mockeada';

globalCons: globalConstants;

@Component({
    selector: 'app-tramites',
    templateUrl: './tramites.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../assets/demo/badges.scss'],
    styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }

       
        
    `]
})
export class TramitesComponent implements OnInit {
    //para mensajes
    msgs: Message[] = [];
    
    customers1: Customer[];  
    selectedCustomers1: Customer[];
    selectedCustomer: Customer;

    representatives: Representative[];
    statuses: any[];

    activityValues: number[] = [0, 100];
    idFrozen: boolean = false;

    loading:boolean = true;

    expandedRows = {};
    isExpanded: boolean = false;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;    

    //FORMULARIOS
    formaTramites: FormGroup;
    formaMovimientosTramite: FormGroup;
    formaSalidaTramite: FormGroup;
    formaIngresoTramite: FormGroup;

    //VARIABLES TRAMITE    
    tramite: TramiteModel;
    tramiteDialog: boolean;
    nuevoTramite: boolean;
    submitted: boolean;
    
    //VARIABLES MOVIMIENTOS    
    movimientoTramite: MovimientoTramiteModel;
    tramiteSalidaDialog: boolean;
  
    //LISTAS    
    listaTramites: TramiteModel[]=[];
    listaSectores: SectorModel[]=[];
    listaOrganismos: OrganismoModel[]= [];
    listaTiposTramite: TipoTramiteModel[]=[];
    listaMovimientosTramite: MovimientoTramiteModel[]=[];

    constructor(
        private serviceMensajes: MessageService,
        private customerService: CustomerService,
        private tramitesService: TramitesService,
        private movimientosTramiteService: MovimientosTramiteService,
        private sectoresService: SectoresService,
        private tiposTramiteService: TiposTramiteService,
        private fb: FormBuilder
    ) {
        
        //FORMULARIO TRASLADO    
        this.formaTramites = this.fb.group({
            // id_tramite: [0,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
            // numero_tramite: [,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1), Validators.max(99000000)]],
            asunto: [,[Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            expediente_nota: [,[Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(50)]],
            persona_referencia: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(1), Validators.maxLength(50)]],
            descripcion: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(1), Validators.maxLength(500)]],
           
            tipo_tramite_id: [1,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
            // sector_id: [8,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
            // usuario_id: [8,[Validators.required, Validators.pattern(/^[0-9]*$/)]]
        });
        //FIN FORMULARIO TRASLADO
    
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

        //FORMULARIO SALIDA TRAMITE    
        this.formaSalidaTramite = this.fb.group({
            tramite_numero: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
            num_movimiento_tramite: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
            organismo_destino_id: [globalConstants.organismo_usuario,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
            sector_destino_id: [1,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
            fojas_salida: [0,[Validators.required,Validators.pattern(/^[0-9]*$/)]],
            descripcion_salida: [,[Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
           
        });
        //FIN FORMULARIO SALIDA TRAMITE


    }

    
    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => {
            this.customers1 = customers;
            this.loading = false;

            // @ts-ignore
            this.customers1.forEach(customer => customer.date = new Date(customer.date));
        });

        this.representatives = [
            {name: 'Amy Elsner', image: 'amyelsner.png'},
            {name: 'Anna Fali', image: 'annafali.png'},
            {name: 'Asiya Javayant', image: 'asiyajavayant.png'},
            {name: 'Bernardo Dominic', image: 'bernardodominic.png'},
            {name: 'Elwin Sharvill', image: 'elwinsharvill.png'},
            {name: 'Ioni Bowcher', image: 'ionibowcher.png'},
            {name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png'},
            {name: 'Onyama Limba', image: 'onyamalimba.png'},
            {name: 'Stephen Shaw', image: 'stephenshaw.png'},
            {name: 'XuXue Feng', image: 'xuxuefeng.png'}
        ];

        this.statuses = [
            {label: 'Unqualified', value: 'unqualified'},
            {label: 'Qualified', value: 'qualified'},
            {label: 'New', value: 'new'},
            {label: 'Negotiation', value: 'negotiation'},
            {label: 'Renewal', value: 'renewal'},
            {label: 'Proposal', value: 'proposal'}
        ];

        this.listarTramites();
        //this.listarSectores();
        this.cargarSectores(globalConstants.organismo_usuario);
        this.listarTiposTramite();
        this.listaOrganismos = organismos;
    }

    //MENSAJES DE VALIDACIONES
    user_validation_messages = {
    //datos tramite
        'asunto': [
            { type: 'required', message: 'El asunto es requerido' },
            { type: 'minlength', message: 'La cantidad mínima de caracteres es 2.' },
            { type: 'maxlength', message: 'La cantidad máxima de caracteres es 100.' }
        ],
        'expediente_nota': [
            { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
            { type: 'minlength', message: 'La cantidad mínima de caracteres es 0.' },
            { type: 'maxlength', message: 'La cantidad máxima de caracteres es 50.' }
        ],
        'persona_referencia': [
            { type: 'required', message: 'La persona de referencia es requerido' },
            { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
            { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
            { type: 'maxlength', message: 'La cantidad máxima de caracteres es 50.' }
        ],
        'descripcion': [
            { type: 'required', message: 'La descripción es requerida' },
            { type: 'pattern', message: 'Solo se pueden ingresar números, letras y espacios.' },
            { type: 'minlength', message: 'La cantidad mínima de caracteres es 1.' },
            { type: 'maxlength', message: 'La cantidad máxima de caracteres es 500.' }
        ],
        'tipo_tramite_id': [
            { type: 'required', message: 'El tipo de tramite es requerido' },
            { type: 'pattern', message: 'Solo se pueden ingresar números.' }
        ],
    }
    //FIN MENSAJES DE VALIDACIONES...............................................................

    //VALIDACIONES DE FORMULARIO TRANITES
    get asuntoNotaNoValido(){
        return this.formaTramites.get('asunto')?.invalid && this.formaTramites.get('asunto')?.touched;
    }
    get expedienteNotaNoValido(){
        return this.formaTramites.get('expediente_nota')?.invalid && this.formaTramites.get('expediente_nota')?.touched;
    }
    get personaReferenciaNotaNoValido(){
        return this.formaTramites.get('persona_referencia')?.invalid && this.formaTramites.get('persona_referencia')?.touched;
    }
    get descripcionNotaNoValido(){
        return this.formaTramites.get('descripcion')?.invalid && this.formaTramites.get('descripcion')?.touched;
    }
    get tipoTramiteNotaNoValido(){
        return this.formaTramites.get('tipo_tramite_id')?.invalid && this.formaTramites.get('tipo_tramite_id')?.touched;
    }
       

    //GUARDAR TRAMITE  
    submitFormTramite(){
        if(this.formaTramites.invalid){                        
            this.msgs = [];
            this.msgs.push({ severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los datos' });
            this.serviceMensajes.add({key: 'tst', severity: 'warn', summary: 'Errores en formulario', detail: 'Cargue correctamente los dato'});
            // Swal.fire(
                
            //     {target: document.getElementById('form-modal')},
            //     'Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning"
            //     );
            return Object.values(this.formaTramites.controls).forEach(control => control.markAsTouched());
        }
    
        let dataTramite: Partial<TramiteModel>;
        dataTramite = {
            
            asunto: this.formaTramites.get('asunto')?.value,
            expediente_nota: this.formaTramites.get('expediente_nota')?.value,
            persona_referencia: this.formaTramites.get('persona_referencia')?.value,
            descripcion: this.formaTramites.get('descripcion')?.value,
            tipo_tramite_id: parseInt(this.formaTramites.get('tipo_tramite_id')?.value),
            sector_id: globalConstants.sector_usuario,
            usuario_id: globalConstants.id_usuario
        }
        
        //GUARDAR NUEVO TRAMITE
        this.tramitesService.guardarTramite(dataTramite)
            .subscribe(resultado => {
                let tramiteRes: TramiteModel = resultado;
                let dataMovimientoTramite: Partial <MovimientoTramiteModel>;
                dataMovimientoTramite = {
                    tramite_numero: tramiteRes.numero_tramite,
                    sector_origen_id: parseInt(this.formaMovimientosTramite.get('sector_origen_id')?.value),                    
                    fojas_ingreso: parseInt(this.formaMovimientosTramite.get('fojas_ingreso')?.value),
                    descripcion_ingreso: this.formaMovimientosTramite.get('descripcion_ingreso')?.value,
                    usuario_id: globalConstants.id_usuario,
                    sector_id: globalConstants.sector_usuario
                    
                }
                //GUARDAR MOVIMIENTO
                    this.movimientosTramiteService.guardarMovimientoTramite(dataMovimientoTramite)
                        .subscribe(resMovimiento => {
                            this.hideDialogTramite();
                            Swal.fire('Exito',`El Tramite fue guardado con Exito`,"success");
                            this.listarTramites();
                        })
                //FIN GUARDAR MOVIMIENTO
               
            }
            // , (error) => {
            //     Swal.fire('Error',`Error al cargar el nuevo tramite: ${error.error.message}`,"error") 
            // }
            );         
        //FIN GUARDAR NUEVO TRAMITE 

    }    
    //FIN GUARDAR TRAMITE......................................
    
    //LISTADO DE TRAMITES
    listarTramites(){    
        this.tramitesService.listarTramites().
            subscribe(respuesta => {
            this.listaTramites= respuesta;  
        
        });
    }
    //FIN LISTADO DE TRAMITES 



    //LISTADO DE TRAMITES
    listarSectores(){    
        this.sectoresService.listarSectores().
            subscribe(respuesta => {
            this.listaSectores= respuesta   
        
        });
    }
    //FIN LISTADO DE TRAMITES.................................................................


    //LISTADO MOVIMIENTOS DE TRAMITE
    listarHistorialTramite(tramite: TramiteModel){ 
        this.expandedRows={};
        if(tramite){
                this.movimientosTramiteService.listarHistorialTramite(tramite.numero_tramite).
                subscribe(respuesta => {
                this.listaMovimientosTramite= respuesta[0];             
                this.expandedRows[tramite.numero_tramite]=true;
            });
        } 
        
    }
    //FIN LISTADO MOVIMIENTO DE TRAMITE...................................................

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
            tramite_numero: parseInt(this.formaMovimientosTramite.get('tramite_numero')?.value),
            num_movimiento_tramite: parseInt(this.formaMovimientosTramite.get('num_movimiento_tramite')?.value),
            sector_destino_id: parseInt(this.formaMovimientosTramite.get('sector_id')?.value),                    
            fojas_salida: parseInt(this.formaMovimientosTramite.get('fojas')?.value),
            descripcion_salida: this.formaMovimientosTramite.get('descripcion')?.value,
            usuario_id: globalConstants.id_usuario,
            sector_id: globalConstants.sector_usuario
            
        }
        //GUARDAR SALIDA MOVIMIENTO
        this.movimientosTramiteService.salidaMovimientoTramite(dataMovimientoTramite)
            .subscribe(resMovimiento => {
                this.hideDialogTramite();
                Swal.fire('Exito',`El Tramite fue guardado con Exito`,"success");
                this.listarTramites();
            })
        //FIN GUARDAR SALIDA MOVIMIENTO

    }    
    //FIN GUARDAR SALIDA TRAMITE............................................................................

    

    //LISTADO DE TIPO TRAMITES
    listarTiposTramite(){    
        this.tiposTramiteService.listarTiposTramite().
            subscribe(respuesta => {
            this.listaTiposTramite= respuesta;
        
        });
    }
    //FIN LISTADO DE TIPO TRAMITES

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }   

    //MANEJO DE FORMULARIO DIALOG
    openNewTramite() {
        this.tramite = {};
        this.submitted = false;
        this.tramiteDialog = true;
        this.nuevoTramite=true;
    }

    hideDialogTramite() {
        this.tramiteDialog = false;
        this.submitted = false;
        this.nuevoTramite=false;
    }    
    //FIN MANEJO FORMULARIO DIALOG....................................

    //MANEJO DE FORMULARIO SALIDA DIALOG
    openDialogSalida(movimiento: MovimientoTramiteModel) {
        //this.movimientoTramite = {};
        this.submitted = false;
        this.tramiteSalidaDialog = true;
        this.formaMovimientosTramite.get('tramite_numero')?.setValue(movimiento.tramite_numero);               
        this.formaMovimientosTramite.get('num_movimiento_tramite')?.setValue(movimiento.num_movimiento_tramite);  
        //this.nuevoTramite=true;
    }

    hideDialogSalida() {
        this.tramiteSalidaDialog = false;
        this.submitted = false;
        //this.nuevoTramite=false;
    }    
    //FIN MANEJO FORMULARIO SALIDA DIALOG....................................

    //CARGA DE LISTADOS DROP
    cargarSectores(id_organismo: number){
        let mi_organismo = globalConstants.organismo_usuario;
        if (id_organismo == mi_organismo)
        {
            this.listaSectores=sectores.filter(sector => {      
                return sector.id_sector == 1 || sector.organismo_id == id_organismo;
              });
        }
        else{
            this.listaSectores=sectores.filter(sector => {      
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
}
