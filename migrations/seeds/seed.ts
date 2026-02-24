import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Room } from '../../src/room/domain/room.entity';
import { Zone } from '../../src/zone/domain/zone.entity';
import { Rack } from '../../src/rack/domain/rack.entity';
import { Shelf } from '../../src/shelf/domain/shelf.entity';
import { RoomSeeder } from './room.seeder';
import { ZoneSeeder } from './zone.seeder';
import { RackSeeder } from './rack.seeder';
import { ShelfSeeder } from './shelf.seeder';

dotenv.config();

const seedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'myuser',
  password: process.env.DATABASE_PASSWORD || 'mypassword',
  database: process.env.DATABASE_NAME || 'stockdb',
  entities: [Room, Zone, Rack, Shelf],
  synchronize: false,
});

async function runSeeders(): Promise<void> {
  await seedDataSource.initialize();
  console.log('Database connected\n');

  try {
    console.log('Running RoomSeeder...');
    const rooms = await new RoomSeeder().run(seedDataSource);

    console.log('\nRunning ZoneSeeder...');
    const zones = await new ZoneSeeder().run(seedDataSource, rooms);

    console.log('\nRunning RackSeeder...');
    const racks = await new RackSeeder().run(seedDataSource, zones);

    console.log('\nRunning ShelfSeeder...');
    await new ShelfSeeder().run(seedDataSource, racks);

    console.log('\nAll seeders completed successfully.');
  } catch (err) {
    console.error('Seeder error:', err);
    throw err;
  } finally {
    await seedDataSource.destroy();
  }
}

runSeeders().catch(() => process.exit(1));
