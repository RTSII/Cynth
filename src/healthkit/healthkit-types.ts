export enum HealthKitDataType {
  ACTIVE_ENERGY_BURNED = 'activeEnergyBurned',
  STEPS = 'steps',
  WORKOUT = 'workout',
}

export interface HealthKitPermissions {
  read: HealthKitDataType[];
}