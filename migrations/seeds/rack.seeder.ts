import { DataSource, Repository } from 'typeorm';
import { Rack } from '../../src/rack/domain/rack.entity';
import { Zone } from '../../src/zone/domain/zone.entity';

interface RackSeedData {
  name: string;
  description: string | null;
  zoneName: string;
}

const RACKS: RackSeedData[] = [
  { name: 'Rack A0-Default', description: 'Default rack for uncategorized items', zoneName: 'Zone A0' },
  { name: 'Rack A1-01', description: 'Upper rack', zoneName: 'Zone A1' },
  { name: 'Rack A1-02', description: 'Lower rack', zoneName: 'Zone A1' },
  { name: 'Rack A2-01', description: 'Upper rack', zoneName: 'Zone A2' },
  { name: 'Rack A2-02', description: 'Lower rack', zoneName: 'Zone A2' },
  { name: 'Rack B0-Default', description: 'Default refrigerated rack for uncategorized items', zoneName: 'Zone B0' },
  { name: 'Rack B1-01', description: 'Refrigerator rack 1', zoneName: 'Zone B1' },
  { name: 'Rack B2-01', description: 'Refrigerator rack 1', zoneName: 'Zone B2' },
  { name: 'Rack C0-Default', description: 'Default secured rack for uncategorized items', zoneName: 'Zone C0' },    
  { name: 'Rack C1-01', description: 'Secured rack', zoneName: 'Zone C1' },
];

export class RackSeeder {
  async run(dataSource: DataSource, zones: Zone[]): Promise<Rack[]> {
    const rackRepo: Repository<Rack> = dataSource.getRepository(Rack);
    const seeded: Rack[] = [];

    for (const data of RACKS) {
      const zone = zones.find((z) => z.name === data.zoneName);

      if (!zone) {
        console.log(`  Skipped rack: ${data.name} — zone "${data.zoneName}" not found`);
        continue;
      }

      let rack = await rackRepo.findOneBy({ name: data.name, zoneId: zone.id });

      if (!rack) {
        rack = await rackRepo.save(
          rackRepo.create({ name: data.name, description: data.description, zoneId: zone.id }),
        );
        console.log(`  Created rack: ${rack.name} (${zone.name})`);
      } else {
        console.log(`  Skipped rack (already exists): ${rack.name}`);
      }

      seeded.push(rack);
    }

    return seeded;
  }
}
