import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Zone } from '../../zone/domain/zone.entity';
import { Shelf } from '../../shelf/domain/shelf.entity';

@Entity({ name: 'racks' })
export class Rack extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'zone_id', type: 'uuid' })
  zoneId: string;

  @ManyToOne(() => Zone, (zone) => zone.racks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @OneToMany(() => Shelf, (shelf) => shelf.rack)
  shelves: Shelf[];
}
