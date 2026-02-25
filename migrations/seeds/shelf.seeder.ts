import { DataSource, Repository } from 'typeorm';
import { Shelf } from '../../src/shelf/domain/shelf.entity';
import { Rack } from '../../src/rack/domain/rack.entity';

interface ShelfSeedData {
  name: string;
  description: string | null;
  rackName: string;
  capacity: number;
}

const SHELVES: ShelfSeedData[] = [
  { name: 'Shelf A0-Default', description: 'Default shelf for uncategorized items', rackName: 'Rack A0-Default', capacity: 50 },
  { name: 'Shelf A1-01-S1', description: 'Top shelf', rackName: 'Rack A1-01', capacity: 50 },
  { name: 'Shelf A1-01-S2', description: 'Middle shelf', rackName: 'Rack A1-01', capacity: 50 },
  { name: 'Shelf A1-01-S3', description: 'Bottom shelf', rackName: 'Rack A1-01', capacity: 50 },
  { name: 'Shelf A1-02-S1', description: 'Top shelf', rackName: 'Rack A1-02', capacity: 50 },
  { name: 'Shelf A1-02-S2', description: 'Bottom shelf', rackName: 'Rack A1-02', capacity: 50 },
  { name: 'Shelf A2-01-S1', description: 'Top shelf', rackName: 'Rack A2-01', capacity: 40 },
  { name: 'Shelf A2-01-S2', description: 'Bottom shelf', rackName: 'Rack A2-01', capacity: 40 },
  { name: 'Shelf A2-02-S1', description: 'Top shelf', rackName: 'Rack A2-02', capacity: 40 },
  { name: 'Shelf B0-Default', description: 'Default refrigerated shelf for uncategorized items', rackName: 'Rack B0-Default', capacity: 30 },
  { name: 'Shelf B1-01-S1', description: 'Refrigerated shelf 1', rackName: 'Rack B1-01', capacity: 30 },
  { name: 'Shelf B1-01-S2', description: 'Refrigerated shelf 2', rackName: 'Rack B1-01', capacity: 30 },
  { name: 'Shelf B2-01-S1', description: 'Refrigerated shelf 1', rackName: 'Rack B2-01', capacity: 20 },
  { name: 'Shelf C0-Default', description: 'Default secured shelf for uncategorized items', rackName: 'Rack C0-Default', capacity: 20 },
  { name: 'Shelf C1-01-S1', description: 'Secured shelf 1', rackName: 'Rack C1-01', capacity: 20 },
  { name: 'Shelf C1-01-S2', description: 'Secured shelf 2', rackName: 'Rack C1-01', capacity: 20 },
];

export class ShelfSeeder {
  async run(dataSource: DataSource, racks: Rack[]): Promise<void> {
    const shelfRepo: Repository<Shelf> = dataSource.getRepository(Shelf);

    for (const data of SHELVES) {
      const rack = racks.find((r) => r.name === data.rackName);

      if (!rack) {
        console.log(`  Skipped shelf: ${data.name} — rack "${data.rackName}" not found`);
        continue;
      }

      const existing = await shelfRepo.findOneBy({ name: data.name, rackId: rack.id });

      if (!existing) {
        await shelfRepo.save(
          shelfRepo.create({
            name: data.name,
            description: data.description,
            rackId: rack.id,
            capacity: data.capacity,
            quantity: 0,
          }),
        );
        console.log(`  Created shelf: ${data.name} (${rack.name})`);
      } else {
        console.log(`  Skipped shelf (already exists): ${data.name}`);
      }
    }
  }
}
