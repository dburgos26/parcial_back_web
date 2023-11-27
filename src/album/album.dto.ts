import {IsNotEmpty, IsString, IsUrl, IsDate} from 'class-validator';

export class AlbumDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsUrl()
    caratula: string;

    @IsNotEmpty()
    @IsDate()
    fecha_lanzamiento: Date;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

}
