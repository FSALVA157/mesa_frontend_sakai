import { SectorModel } from '../models/sector.model';
import { IUsuarioModel } from '../models/usuario.model';


export class globalConstants {
    public static urlImagen: string = "";
    public static validado: boolean = false;
    public static usuario: IUsuarioModel;
    public static nombreUsuario: string = "";
    public static sector:SectorModel;
    public static inicialesUsuario: string = "";
    public static emailUsuario: string = "";       
    public static sector_corto: string;
    public static rol_usuario: string;
    public static id_usuario: number=1;   
    
}