import { Event, renderStyles } from '@ima/server';

export function createLegacyCssHook({ emitter }) {
  emitter.on(Event.CreateContentVariables, ({ context, result }) => {
    // IF NOT LEGACY
    // return result

    return {
      ...result,
      styles: renderStyles(result._.resources.styles),
    };
  });
}
