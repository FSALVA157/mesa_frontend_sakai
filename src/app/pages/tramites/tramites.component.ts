
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Customer, Representative } from '../../api/customer';
import { CustomerService } from '../../service/customerservice';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
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
    private customerService: CustomerService,
    private tramitesService: TramitesService,
    private sectoresService: SectoresService,
    private tiposTramiteService: TiposTramiteService,
    private fb: FormBuilder
    ) {
        
    //FORMULARIO TRASLADO    
    this.formaTramites = this.fb.group({
        id_tramite: [0,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
        numero_tramite: [,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(1), Validators.max(99000000)]],
        asunto: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(100)]],
        expediente_nota: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(50)]],
        persona_referencia: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(50)]],
        descripcion: [,[Validators.required,Validators.pattern(/^[A-Za-z0-9./\s]+$/), Validators.minLength(2), Validators.maxLength(500)]],
        // fecha: [,[Validators.required]],
        // anio: [,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.min(2000), Validators.max(2100)]],
        
        tipo_tramite_id: [1,[Validators.required, Validators.pattern(/^[0-9]*$/)]],
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
       

    //GUARDAR TRASLADO  
    submitFormTraslado(){
        // if(this.formaTramites.invalid){
        //     Swal.fire('Formulario Tramite con errores','Complete correctamente todos los campos del formulario',"warning");
        //     return Object.values(this.formaTramites.controls).forEach(control => control.markAsTouched());
        // }
    
        // let data: Partial<TramiteModel>= new TramiteModel;
        //     //poner destino en el personal y sin funcion 
        //     //this.submitForm('cambioDestino');

        // data = {

        //     numero_tramite: parseInt(this.formaTramites.get('numero_tramite')?.value),
        //     asunto: this.formaTramites.get('asunto')?.value,
        //     expediente_nota: this.formaTramites.get('expediente_nota')?.value,
        //     persona_referencia: this.formaTramites.get('persona_referencia')?.value,
        //     descripcion: this.formaTramites.get('descripcion')?.value,
        //     fecha: new Date("2022-01-01"),
        //     anio: 2022,
        //     tipo_tramite_id: parseInt(this.formaTramites.get('tipo_tramite_id')?.value),
        //     sector_id: 64,
        //     usuario_id: 1
        // }

        // this.tramitesService.guardarTramite(data);
        //this.listarTramites();

        //GUARDAR NUEVO TRASLADO
        // if(this.nuevoTramite){       
        //     this.tramitesService.guardarTramite(data);
        //     this.listarTramites();
        // this.tramitesService.guardarTramite(data).
        // subscribe(resultado => {
            
        //     Swal.fire('Nuevo Tramite',`El Tramite ha sido guardado con exito`,"success");
            
        //     this.listarTramites();          
                    
        // },
        // error => {
            
        //     Swal.fire('Nuevo traslado',`Error al guardar el Traslado: ${error.error.message}`,"error")                          
        // });
                
        
        }
        //FIN GUARDAR NUEVO TRASLADO 

        
    //FIN GUARDAR TRASLADO
    
    //LISTADO DE TRAMITES
    listarTramites(){    
        this.tramitesService.listarTramites().
            subscribe(respuesta => {
            this.listaTramites= respuesta,
            console.log("tramites", this.listaTramites);    
        
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

    
    //FIN MANEJO FORMULARIO DIALOG
}
