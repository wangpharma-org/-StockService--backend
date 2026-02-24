import { DataSource, Repository } from 'typeorm';
import { Room } from '../../src/room/domain/room.entity';

interface RoomSeedData {
  name: string;
  description: string | null;
}

const ROOMS: RoomSeedData[] = [
  { name: 'Room A', description: 'Main pharmaceutical storage room' },
  { name: 'Room B', description: 'Cold storage room' },
  { name: 'Room C', description: 'Controlled substances room' },
];

export class RoomSeeder {
  async run(dataSource: DataSource): Promise<Room[]> {
    const roomRepo: Repository<Room> = dataSource.getRepository(Room);
    const seeded: Room[] = [];

    for (const data of ROOMS) {
      let room = await roomRepo.findOneBy({ name: data.name });

      if (!room) {
        room = await roomRepo.save(roomRepo.create(data));
        console.log(`  Created room: ${room.name}`);
      } else {
        console.log(`  Skipped room (already exists): ${room.name}`);
      }

      seeded.push(room);
    }

    return seeded;
  }
}
