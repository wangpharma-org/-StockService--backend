import { DataSource, Repository } from 'typeorm';
import { Zone } from '../../src/zone/domain/zone.entity';
import { Room } from '../../src/room/domain/room.entity';

interface ZoneSeedData {
  name: string;
  description: string | null;
  roomName: string;
}

const ZONES: ZoneSeedData[] = [
  { name: 'Zone A0', description: 'Default zone for uncategorized items', roomName: 'Room A' },
  { name: 'Zone A1', description: 'Antibiotics zone', roomName: 'Room A' },
  { name: 'Zone A2', description: 'Analgesics zone', roomName: 'Room A' },
  { name: 'Zone B0', description: 'Default refrigerated zone for uncategorized items', roomName: 'Room B' },
  { name: 'Zone B1', description: 'Refrigerated vaccines zone', roomName: 'Room B' },
  { name: 'Zone B2', description: 'Refrigerated biologics zone', roomName: 'Room B' },
  { name: 'Zone C0', description: 'Default secured zone for uncategorized items', roomName: 'Room C' },
  { name: 'Zone C1', description: 'Narcotics zone', roomName: 'Room C' },
];

export class ZoneSeeder {
  async run(dataSource: DataSource, rooms: Room[]): Promise<Zone[]> {
    const zoneRepo: Repository<Zone> = dataSource.getRepository(Zone);
    const seeded: Zone[] = [];

    for (const data of ZONES) {
      const room = rooms.find((r) => r.name === data.roomName);

      if (!room) {
        console.log(`  Skipped zone: ${data.name} — room "${data.roomName}" not found`);
        continue;
      }

      let zone = await zoneRepo.findOneBy({ name: data.name, roomId: room.id });

      if (!zone) {
        zone = await zoneRepo.save(
          zoneRepo.create({ name: data.name, description: data.description, roomId: room.id }),
        );
        console.log(`  Created zone: ${zone.name} (${room.name})`);
      } else {
        console.log(`  Skipped zone (already exists): ${zone.name}`);
      }

      seeded.push(zone);
    }

    return seeded;
  }
}
