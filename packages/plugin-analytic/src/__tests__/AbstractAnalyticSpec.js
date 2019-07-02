import AbstractAnalytic from '../AbstractAnalytic';
import Window from 'ima/window/Window';
import Dispatcher from 'ima/event/Dispatcher';
import { ScriptLoaderPlugin } from 'ima-plugin-script-loader';
import { toMockedInstance } from 'to-mock';

describe('AbstractAnalytic', () => {
    let abstractAnalytic = null;

    const window = toMockedInstance(Window, {
        isClient() {
            return true;
        }
    });
    const dispatcher = toMockedInstance(Dispatcher);
    const scriptLoader = toMockedInstance(ScriptLoaderPlugin, {
        load() {
            return Promise.resolve(null)
        }
    });

    beforeEach(() => {
        abstractAnalytic = new AbstractAnalytic(
            scriptLoader,
            window,
            dispatcher
        );

        abstractAnalytic._analyticScriptUrl = 'http://example.net/script.js';

        global.$Debug = true;
    });

    afterEach(() => {
        delete global.$Debug;
    });

    describe('init() method', () => {
        it ('should call abstracted `createGlobalDefinition` method.', () => {
            spyOn(abstractAnalytic, 'createGlobalDefinition').and.stub();

            abstractAnalytic.init();
            expect(abstractAnalytic.createGlobalDefinition).toHaveBeenCalled();
        });
    });

    describe('load() method', () => {
        beforeEach(() => {
            spyOn(scriptLoader, 'load').and.callThrough();
            spyOn(abstractAnalytic, '_configuration').and.stub();
        });

        it('should do nothing on server side.', done => {
            spyOn(window, 'isClient').and.returnValue(false);

            abstractAnalytic
                .load()
                .then(() => {
                    expect(scriptLoader.load).not.toHaveBeenCalled();
                    done();
                })
                .catch(error => {
                    done(error);
                });
        });

        it('should load analytic script and call configuration method.', done => {
            abstractAnalytic
                .load()
                .then(() => {
                    expect(scriptLoader.load).toHaveBeenCalled();
                    expect(abstractAnalytic._configuration).toHaveBeenCalled();
                    done();
                })
                .catch(error => {
                    done(error);
                });
        });

        it('should executed every deferred hit.', done => {
            const observer = { callback: function() { } };

            spyOn(observer, 'callback').and.stub();

            abstractAnalytic._deferredHits = [
                { callback: observer.callback }
            ];

            abstractAnalytic
                .load()
                .then(() => {
                    expect(observer.callback).toHaveBeenCalled();
                    done();
                })
                .catch(error => {
                    done(error);
                });
        });
    });

    describe('deferHitAfterLoad() method', () => {

        it('should call callback immediatelly if already loaded.', () => {
            const observer = { callback: function() { } };

            spyOn(observer, 'callback').and.stub();
            spyOn(abstractAnalytic, 'isEnabled').and.returnValue(true);

            abstractAnalytic.deferHitAfterLoad(observer.callback);

            expect(observer.callback).toHaveBeenCalled();
        });

        it('should store given callback and wait after script is loaded.', () => {
            const observer = { callback: function() { } };

            abstractAnalytic.deferHitAfterLoad(observer.callback);

            expect(abstractAnalytic._deferredHits.length).toBe(1);
        });

        it('should not store any more hits if it exceeds set limit.', () => {
            const observer = { callback: function() { } };
            const initialHitsSize = abstractAnalytic.MAX_DEFERRED_HITS_SIZE + 1;
            abstractAnalytic._deferredHits = Array(initialHitsSize);

            abstractAnalytic.deferHitAfterLoad(observer.callback);

            expect(abstractAnalytic._deferredHits.length).toBe(initialHitsSize);
        });
    });
});
