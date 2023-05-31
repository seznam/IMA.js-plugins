import { Event, renderStyles } from '@ima/server';

export function createLegacyCssHook(
  isLegacy: (event: any) => boolean,
  { emitter }: { emitter: any }
) {
  emitter.on(Event.CreateContentVariables, (event: any) => {
    const { result } = event;

    if (!isLegacy(event)) {
      return result;
    }

    return {
      ...result,
      styles: renderStyles(result._.resources.styles),
    };
  });
}
