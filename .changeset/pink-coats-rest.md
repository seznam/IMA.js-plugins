---
"@ima/plugin-analytic": major
---

Removed config from constructor of `AbstractAnalytic`

- **What?** Removed config from constructor of `AbstractAnalytic`
- **Why?** To be able to use spread operator for dependencies in constructor of classes which extends `AbstractAnalytic`.
Until now, we had to repeat all arguments from `AbstractAnalytic` constructor if we wanted to access `config` parameter, which is very common use-case.
Also, now we can work with types in TypeScript more easily.
- **How?** Classes, which extends `AbstractAnalytic` needs to save given config argument on their own.
But you can use rest operator now.

    Therefore, this:
    ```javascript
    class MyClass extends AbstractAnalytic {
        // Even here we were forced to copy dependencies from AbstractAnalytic to specify settings (last value in the array)
        static get $dependencies() {
            return [
                NonAbstractAnalyticParam,
                ScriptLoaderPlugin,
                '$Window',
                '$Dispatcher',
                '$Settings.plugin.analytic.myClass',
            ];
        }
        
        constructor(nonAbstractAnalyticParam, scriptLoader, window, dispatcher, config) {
            super(scriptLoader, window, dispatcher, config);
            
            this._nonAbstractAnalyticParam = nonAbstractAnalyticParam;
            
            this._id = config.id; // due to this line we were forced to copy all arguments of AbstractAnalytic
            
            // ...
        }
    }
    ```
    ...can be rewritten to this:
    ```javascript
    class MyClass extends AbstractAnalytic {
        // now we can define only added dependencies and use spread for the rest
        static get $dependencies() {
            return [
                NonAbstractAnalyticParam,
                '$Settings.plugin.analytic.myClass',
                ...AbstractAnalytic.$dependencies
            ];
        }
        
        constructor(nonAbstractAnalyticParam, config, ...rest) {
            super(...rest);
            
            this._nonAbstractAnalyticParam = nonAbstractAnalyticParam;
            
            this._config = config;
        
            this._id = config.id;
            
            // ...
        }
    }
    ```