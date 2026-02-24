export interface IStockRepository {
  // Sum total quantity of a medicine across all shelves inside a room
  sumQuantityByMedicineInRoom(medicineId: string, roomId: string): Promise<number>;
}

export const STOCK_REPOSITORY = Symbol('IStockRepository');

