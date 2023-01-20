import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { OrganismoModel } from 'src/app/models/organismo.model';
import { SectorModel } from 'src/app/models/sector.model';
import { IUsuarioModel } from '../../models/usuario.model';
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  //para mensajes
  msgs: Message[] = [];

  loading:boolean = true;
  form_submitted: boolean = false;

  @ViewChild('filter') filter: ElementRef;    
  
  @ViewChild('dt') table: Table;

  //LISTAS
  listUsuarios: IUsuarioModel[]=[];
  listSectores: SectorModel[]=[];
  listOrganismos: OrganismoModel[]= [];

  //VARIABLES USUARIOS    
  usuario: IUsuarioModel;
  usuarioDialog: boolean;

  //FORMULARIO
  forma: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
  ) { 
    this.forma = this.fb.group({
      usuario: ['',[Validators.required, Validators.minLength(5)]],
      correo:   ['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      clave1:    ['',[Validators.required,  Validators.minLength(6)]],
      clave2:    ['',[Validators.required,  Validators.minLength(6)]],
      legajo:   ['',[Validators.required]],
      apellido: ['',[Validators.required,  Validators.minLength(2)]],
      nombre:   ['',[Validators.required,  Validators.minLength(2)]],
      sector_id:['name',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  //VALIDACIONES
  isValid(campo: string): boolean{
    if (this.forma.get(campo).invalid && this.form_submitted) {
      return true;
    }else{
      return false;
    }
  }

  clavesValidation(): boolean{
    return ((this.forma.get('clave1').value === this.forma.get('clave2').value))?  false: true;
        
  }
  //FIN VALIDACIONES

  //LISTADO DE USUARIOS
  listarUsuarios(){ 
    
      this.usuariosService.listarUsuarios().
      subscribe(respuesta => {
        this.listUsuarios= respuesta[0];  
        this.loading = false;    
        console.log("lista usuarios", this.listUsuarios);       
      });
         
  }
  //FIN LISTADO DE USUARIOS...................................................

  //MANEJO DE  DIALOG INFO
  openDialogUsuario() {
    //this.usuario = {};
    //this.movimientoTramite= movimiento;
    this.usuarioDialog = true;
     
    //this.nuevoTramite=true;
  }
  
  hideDialogUsuario() {
    //this.movimientoTramite={};
    this.usuarioDialog = false;
    //this.nuevoTramite=false;
  }    
  //FIN MANEJO DIALOG INFO....................................

   //LIMPIAR
   clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
  //FIN LIMPIAR  

}
