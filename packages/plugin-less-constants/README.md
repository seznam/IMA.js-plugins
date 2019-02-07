# IMA.js plugin LESS constants

IMA.js plugin for sharing constants between JavaScript and LESS code.

## Setup

First install the plugin using npm:

```bash
npm install --save-dev ima-plugin-less-constants
```

Next you need to create your layout configuration file `app/config/layout.js`:

```javascript
import { string, number } from 'ima-plugin-less-constants/constants';
import { px, em, rem, percent, hex, rgba } from 'ima-plugin-less-constants/units';
import { maxWidthMedia, minWidthMedia, minAndMaxWidthMedia, maxHeightMedia, minHeightMedia } from 'ima-plugin-less-constants/media';

export default {
	// example configuration
	staticResourcesRoot: string('/static'),
	applicationVersion: number(2),
	
	primaryColor: hex('cc0000'),
	fadedPrimaryColor: rgba(217, 0, 0, 0.7),
	
	headerHeight: px(80),
	footerHeight: rem(6),
	
	inlineMainMenu: minWidthMedia(px(800))
};

```

After that, you need to add the plugin to the bundled application plugins by
adding the following lines to the `vendors.common` array in the `app/build.js`:

```javascript
'ima-plugin-less-constants/media',
'ima-plugin-less-constants/constants',
'ima-plugin-less-constants/units',
'ima-plugin-less-constants/util'
```

Now you can register the gulp task with the gulp task loader in your project's
`gulpfile.js` by adding the following path to the task paths array:

```javascript
'./node_modules/ima-plugin-less-constants/tasks'
```

Finally, you need to add the `less:constants` task to the tasks executed within
the `dev` and `build` tasks **before** the `less` task. This is usually done
by editing the `tasks` object in the `gulpConfig.js` file.

Result of running the `less:constants` task can be seen in
`app/assets/less/settings.less`. This file contains all variables you've defined
in your `app/config/layout.js` and it'll be imported later in the `less` task.

## Usage note

Please note that it is currently not possible to rename the imported unit and
media functions (`px`, `em`, `rem`, `percent`, `hex`, `rgba`, `maxWidthMedia`,
`minWidthMedia`, `maxHeightMedia`, `minHeightMedia`) in the `layout.js`
configuration file.
