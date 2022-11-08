import ResourceLoader from '../ResourceLoader';

describe('ResourceLoader', () => {
  let resourceLoader = null;
  let element = null;

  beforeEach(() => {
    resourceLoader = new ResourceLoader();
    element = {
      onload() {},
      onerror() {},
      onabort() {},
    };

    global.$Debug = true;
    global.document = {
      head: {
        appendChild() {},
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
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
});
