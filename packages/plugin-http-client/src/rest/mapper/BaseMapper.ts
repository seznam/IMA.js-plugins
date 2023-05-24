export interface Mapper {
  deserialize(value: any): any;
  serialize(value: any): any;
}

export class BaseMapper implements Mapper {
  deserialize(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }
}
