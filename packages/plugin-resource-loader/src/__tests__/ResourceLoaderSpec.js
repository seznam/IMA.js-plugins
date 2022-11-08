import ResourceLoader from '../ResourceLoader';

describe('ResourceLoader', () => {
  let resourceLoader = null;
  let element = null;
  let url = '//example.com/js/script.js';

  beforeEach(() => {
    resourceLoader = new ResourceLoader();
    element = {
      onload() {},
      onerror() {},
      onabort() {}
    };

    global.$Debug = true;
    global.document = {
      head: {
        appendChild() {}
      }
    };
  });

  afterEach(() => {
    delete global.document;
    delete global.$Debug;
  });

  describe('injectToPage method', () => {
    it('should throw an error when used at the server side', () => {
      delete global.document;
      expect(() => {
        resourceLoader.injectToPage({});
      }).toThrow();
    });

    it('should append the resource element to the document head', () => {
      jest
        .spyOn(global.document.head, 'appendChild')
        .mockImplementation(() => {});

      resourceLoader.injectToPage(element);
      expect(global.document.head.appendChild).toHaveBeenCalledWith(element);
    });
  });

  describe('promisify method', () => {
    it('should resolve the load promise when the resource loads', done => {
      resourceLoader.promisify(element, url).then(done);

      element.onload();
    });

    it('should reject the load promise when resource fails to load', done => {
      resourceLoader.promisify(element, url).catch(() => done());

      element.onerror();
    });

    it('should allow rejecting the load promise on abort', done => {
      resourceLoader.promisify(element, url, true).catch(() => done());

      element.onabort();
    });
  });
});
