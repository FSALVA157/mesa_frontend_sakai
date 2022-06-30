
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

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    

    //VARIABLES TRAMITE
    formaTramites: FormGroup;
    tramite: TramiteModel;
    listaTramites: TramiteModel[]=[];
    tramiteDialog: boolean;
    nuevoTramite: boolean;
    submitted: boolean;

  
    //LISTAS
    listaSectores: SectorModel[]=[];
    listaTiposTramite: TipoTramiteModel[]=[];

    constructor(
        private serviceMensajes: MessageService,
        private customerService: CustomerService,
        private tramitesService: TramitesService,
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
       
        tipo_tramite_id: [0,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
        // sector_id: [8,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
        // usuario_id: [8,[Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
    //FIN FORMULARIO TRASLADO
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
        this.listarSectores();
        this.listarTiposTramite();
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
       

    //GUARDAR TRASLADO  
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
    
        let data: Partial<TramiteModel>;
            //poner destino en el personal y sin funcion 
            //this.submitForm('cambioDestino');

        data = {
            
            asunto: this.formaTramites.get('asunto')?.value,
            expediente_nota: this.formaTramites.get('expediente_nota')?.value,
            persona_referencia: this.formaTramites.get('persona_referencia')?.value,
            descripcion: this.formaTramites.get('descripcion')?.value,
            tipo_tramite_id: parseInt(this.formaTramites.get('tipo_tramite_id')?.value),
            sector_id: 64,
            usuario_id: 1
        }
        
        //GUARDAR NUEVO TRAMITE
        this.tramitesService.guardarTramite(data)
            .subscribe(resultado => {
                this.hideDialogTramite();
                Swal.fire('Exito',`El Tramite fue guardado con Exito`,"success");
                this.listarTramites();
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
            this.listaSectores= respuesta,
            console.log("sectores", this.listaSectores);    
        
        });
    }
    //FIN LISTADO DE TRAMITES

    //LISTADO DE TIPO TRAMITES
    listarTiposTramite(){    
        this.tiposTramiteService.listarTiposTramite().
            subscribe(respuesta => {
            this.listaTiposTramite= respuesta,
            console.log("tpos tramite", this.listaTiposTramite);    
        
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
}
