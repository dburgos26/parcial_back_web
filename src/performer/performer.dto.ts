import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class PerformerDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsUrl()
    imagen: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

}
