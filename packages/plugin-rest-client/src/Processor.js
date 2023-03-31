export const Operation = Object.freeze({
  PRE_REQUEST: 'preRequest',
  POST_REQUEST: 'postRequest',
});

export default class Processor {
  // static get $dependencies() {
  //   return [];
  // }


  [Operation.PRE_REQUEST](request) {
    return [request];
  }

  [Operation.POST_REQUEST](request, response) {
    return [request, response];
  }
}
