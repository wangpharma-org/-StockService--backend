import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Zone } from '../../zone/domain/zone.entity';

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => Zone, (zone) => zone.room)
  zones: Zone[];
}
