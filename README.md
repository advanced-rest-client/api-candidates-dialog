[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-candidates-dialog.svg)](https://www.npmjs.com/package/@api-components/api-candidates-dialog)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-url-data-model.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-candidates-dialog)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/api-candidates-dialog)

# api-candidates-dialog

A dialog to select API main file from API zip package

```html
<api-candidates-dialog id="dialog" candidates='["api.raml", "api.yaml", "api.json"]'></api-candidates-dialog>
<button onclick="dialog.opened = true">Open</button>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @api-components/api-candidates-dialog
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-candidates-dialog/api-candidates-dialog.js';
    </script>
  </head>
  <body>
    <api-candidates-dialog></api-candidates-dialog>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@api-components/api-candidates-dialog/api-candidates-dialog.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <api-candidates-dialog></api-candidates-dialog>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Development

```sh
git clone https://github.com/advanced-rest-client/api-candidates-dialog
cd api-candidates-dialog
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
