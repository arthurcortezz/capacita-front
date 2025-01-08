export class HubsdMockApiUtils {
  constructor() {}

  static guid(): string {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const randomValue = randomArray[0] % 16;
      const r = (randomValue & 0x3) | 0x8;
      return (c === 'x' ? r : randomValue).toString(16);
    });
  }
}
