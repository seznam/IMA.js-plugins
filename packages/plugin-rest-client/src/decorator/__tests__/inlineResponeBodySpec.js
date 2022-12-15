import AbstractEntity from '../../AbstractEntity';
import inlineResponseBody from '../inlineResponseBody';

describe('inlineResponseBody', () => {
  it('should configure the inlineResponseBody property', () => {
    class Entity extends AbstractEntity {}

    inlineResponseBody(Entity);
    expect(Entity.inlineResponseBody).toBe(true);
  });
});
