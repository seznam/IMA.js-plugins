export const Operation = Object.freeze({
  PRE_REQUEST: 'preRequest',
  POST_REQUEST: 'postRequest',
});

export default class Processor {
  static get $dependencies() {
    return [];
  }

  get name() {
    return this.constructor.name;
  }

  [Operation.PRE_REQUEST](resourceInfo, request) {
    return [request];
  }

  [Operation.POST_REQUEST](resourceInfo, request, response) {
    return [request, response];
  }
}
