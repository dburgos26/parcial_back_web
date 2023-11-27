import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class TrackDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    duracion: number;

}
