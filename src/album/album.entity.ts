import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class AlbumEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fecha_lanzamiento: Date;

    @Column()
    descripcion: string;

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];

}
