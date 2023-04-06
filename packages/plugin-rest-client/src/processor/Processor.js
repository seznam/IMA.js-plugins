export const Operation = Object.freeze({
  PRE_REQUEST: 'preRequest',
  POST_REQUEST: 'postRequest',
});

export default class Processor {
  get name() {
    return this.constructor.name;
  }

  [Operation.PRE_REQUEST](resource, request) {
    return [request];
  }

  [Operation.POST_REQUEST](resource, request, response) {
    return [request, response];
  }
}
