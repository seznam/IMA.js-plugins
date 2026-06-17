---
"@ima/cli-plugin-less-constants": major
---

Added support for light, dark and custom themes and CSS variables.

**BREAKING CHANGES:**
- plugin option `output` renamed to `outputLessConstants`
- rewritten utility function `slugify` which generates less/css variable names. It transforms correctly first letter to lower case now and it treats subsequent upper case letters as one word. Example:
```javascript
const layout = {
    sizeXXL: 100px; // before: @size-x-x-l; now: @size-xxl;
    MyColor: 'red'; // before: @My-color; now: @my-color;
}
```

- **What?**
    - Plugin always generates two files now - with less variables (same as before) and with CSS variables. Both files contain the same set of variables **EXCEPT** variables defined by media helpers functions - these are not present in CSS variables, because CSS variables cannot be used in media query declarations.
    - New plugin options - all optional: `outputCssConstants`, `defaultTheme` and `themes`.
    - **BREAKING CHANGE:** Option `output` renamed to `outputLessConstants`.
    - New helper functions `theme` (support for themes) and `asMedia` (for defining custom media helpers).
- **Why?** Support for themes implemented with CSS variables.
- **How?**
    - If you set plugin option `output`, rename it to `outputLessConstants`
    - If you have in your js file with less constants some variables beginning with upper case letter or containing a sequence of upper case letters, you need to update your less files - the generated variable name has changed.
    - for more information about new themes check README
