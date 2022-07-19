import { SectorModel } from '../models/sector.model';
import { UsuarioModel } from '../models/usuario.model';


export class globalConstants {
    public static urlImagen: string = "";
    public static validado: boolean = false;
    public static usuario: UsuarioModel;
    public static nombreUsuario: string = "";
    public static inicialesUsuario: string = "";
    public static emailUsuario: string = "";   
    public static organismo_usuario: number=9;
    public static sector_usuario: number = 64;
    public static sector_corto: string;
    public static sector_largo: string="División Despacho de Secretaría General";
    public static rol_usuario: string;
    public static id_usuario: number=1;

    public static sector:SectorModel;

    
    
}