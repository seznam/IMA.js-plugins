import { mountHook } from '../../testUtils';
import { useComponent } from '../component';

describe('useComponent', () => {
  let result;
  let contextMock = {
    urlParams: 'urlParams'
  };

  it('should return utility functions along with url params and currentAbTest properties', () => {
    mountHook(() => {
      result = useComponent();
    }, contextMock);

    expect(result.urlParams).toBe('urlParams');
    expect(
      ['cssClasses', 'localize', 'link', 'fire', 'listen', 'unlisten'].every(
        key => typeof result[key] === 'function'
      )
    );
    expect(Object.keys(result)).toEqual([
      'urlParams',
      'utils',
      'cssClasses',
      'localize',
      'link',
      'fire',
      'listen',
      'unlisten'
    ]);
  });
});
