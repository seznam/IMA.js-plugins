# ima.js-module-skeleton

If you are looking more details, you should
follow this link:
[https://gitlab.kancelar.seznam.cz/IMA.js/module-skeleton](https://gitlab.kancelar.seznam.cz/IMA.js/module-skeleton).

## Create module

```javascript

git clone git@gitlab.kancelar.seznam.cz:IMA.js/module-skeleton.git && rm -rf module-skeleton/.git
cd ..
mv module-skeleton module-*
cd module-*
git init
git add .
git commit -m 'init commit'
git remote add origin git@gitlab.kancelar.seznam.cz:IMA.js/module-*.git
git remote -v
git push origin master

```

Then you must change README.md and package.json for your module.

```javascript

npm install

```

## Publish module

```javascript

npm publish

```

## Tasks

```javascript

gulp test | npm test
gulp dev | npm run dev
gulp build | npm build

```

## Documentation
Run in module directory gulp task for generating documentation with YUIDoc:
```
gulp doc
```
After that you will display module documetation by running ./doc/index.html.
