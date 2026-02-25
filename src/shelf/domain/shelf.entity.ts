import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Rack } from '../../rack/domain/rack.entity';
import { MedicineSnapshot } from '../../medicinesnapshot/domain/medicinesnapshot.entity';

@Entity({ name: 'shelves' })
export class Shelf extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'rack_id', type: 'uuid' })
  rackId: string;

  @ManyToOne(() => Rack, (rack) => rack.shelves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rack_id' })
  rack: Rack;

  @Column({
    name: 'medicine_code',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  medicineCode: string | null;

  @ManyToOne(() => MedicineSnapshot, { nullable: true })
  @JoinColumn({ name: 'medicine_code', referencedColumnName: 'medicineCode' })
  medicineSnapshot: MedicineSnapshot | null;

  @Column({ name: 'capacity', type: 'int', nullable: true })
  capacity: number | null;

  @Column({ name: 'quantity', type: 'int', default: 0 })
  quantity: number;
}
