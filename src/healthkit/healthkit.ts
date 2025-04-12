import {
  HealthKitDataType,
  HealthKitPermissions,
} from './healthkit-types';

class HealthKitManager {
  private static instance: HealthKitManager;
  private isHealthKitAvailable: boolean;
  private isAuthorized: boolean;

  private constructor() {
    this.isHealthKitAvailable = false;
    this.isAuthorized = false;
    this.checkHealthKitAvailability();
  }

  public static getInstance(): HealthKitManager {
    if (!HealthKitManager.instance) {
      HealthKitManager.instance = new HealthKitManager();
    }
    return HealthKitManager.instance;
  }

  private checkHealthKitAvailability(): void {
    if (typeof window !== 'undefined' && (window as any).webkit && (window as any).webkit.messageHandlers && (window as any).webkit.messageHandlers.healthkit) {
      this.isHealthKitAvailable = true;
    } else {
      this.isHealthKitAvailable = false;
    }
  }

  public getIsHealthKitAvailable(): boolean {
    return this.isHealthKitAvailable;
  }

  public getIsAuthorized(): boolean {
    return this.isAuthorized;
  }

  public async requestAuthorization(): Promise<boolean> {
    if (!this.isHealthKitAvailable) {
      console.error('HealthKit is not available on this device.');
      return false;
    }

    return new Promise((resolve) => {
      (window as any).webkit.messageHandlers.healthkit.postMessage({
        action: 'requestAuthorization',
        permissions: {
          read: [
            HealthKitDataType.ACTIVE_ENERGY_BURNED,
            HealthKitDataType.STEPS,
            HealthKitDataType.WORKOUT,
          ],
        },
      });

      (window as any).webkit.messageHandlers.healthkit.onmessage = (event: any) => {
        if (event.data && event.data.action === 'authorizationResponse') {
          if (event.data.status === 'success') {
            this.isAuthorized = true;
            resolve(true);
          } else {
            console.error('HealthKit authorization failed:', event.data.error);
            resolve(false);
          }
        }
      };
    });
  }

  public async readData(
    dataType: HealthKitDataType,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    if (!this.isHealthKitAvailable) {
      console.error('HealthKit is not available on this device.');
      return [];
    }

    if (!this.isAuthorized) {
      console.error('HealthKit is not authorized.');
      return [];
    }

    return new Promise((resolve) => {
      (window as any).webkit.messageHandlers.healthkit.postMessage({
        action: 'readData',
        dataType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      (window as any).webkit.messageHandlers.healthkit.onmessage = (event: any) => {
        if (event.data && event.data.action === 'dataResponse') {
          if (event.data.dataType === dataType) {
            if (event.data.status === 'success') {
              resolve(event.data.data || []);
            } else {
              console.error(
                `Failed to read ${dataType} data:`,
                event.data.error
              );
              resolve([]);
            }
          }
        }
      };
    });
  }
}

export default HealthKitManager;