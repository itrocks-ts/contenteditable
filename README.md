[![view on npm](https://badgen.net/npm/v/@itrocks/contenteditable)](https://www.npmjs.org/package/@itrocks/contenteditable)
[![npm module downloads](https://badgen.net/npm/dt/@itrocks/contenteditable)](https://www.npmjs.org/package/@itrocks/contenteditable)
[![GitHub repo dependents](https://badgen.net/github/dependents-repo/itrocks-ts/contenteditable)](https://github.com/itrocks-ts/contenteditable/network/dependents?dependent_type=REPOSITORY)
[![GitHub package dependents](https://badgen.net/github/dependents-pkg/itrocks-ts/contenteditable)](https://github.com/itrocks-ts/contenteditable/network/dependents?dependent_type=PACKAGE)

# contenteditable

Respectful `contenteditable`: avoids `<div>`, respects `white-space: pre*` styles line breaks.

## Installation

```bash
npm i @itrocks/contenteditable
```

## Usage

```ts
import ContentEditable from './node_modules/@itrocks/contenteditable.js'
new ContentEditable(document.querySelector('#edit-me'))
```

More examples are available in the `demo` folder of the
[GitHub repository](https://github.com/itrocks-ts/contenteditable).

## Behavior

The feature manages the content of a `contenteditable` DOM element during typing
to maintain clean and consistent text.

The last line break is preserved as well.

### Line break matching white-space rule

The line break characters inserted in your `contenteditable` element
depend on its `white-space` style attribute:
- `pre`, `pre-line` or `pre-wrap`: inserts a `\n` character,
- other `white-space` values result result in a `<br>` element.

Any content ending with a line break will have an additional line break added to ensure proper display in your browser.

## API

The following properties and methods are publicly available in the `ContentEditable` class.

### element

The [element](#Parameters) associated with the `ContentEditable` instance,
extended as an `HTMLEditableElement`. It includes a `editable` property that contains the `ContentEditable` instance.

### ContentEditable() constructor

```ts
new ContentEditable(element)
```

Applies the `@itrocks/contenteditable` feature to an element.

Invokes [activate()](#activate) for initialisation.

Starts a [mutation observer](http://developer.mozilla.org/docs/Web/API/MutationObserver) to:
- automatically invoke [deactivate()](#deactivate) when the `contenteditable` attribute is removed,
- automatically invoke [activate()](#activate) when the `contenteditable` attribute is re-added.

#### Parameters

- `element` An [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) to apply the feature to.

### activate()

```ts
activate()
```

Sets the `contenteditable` attribute on your element if it's not already set,

Enables a [keydown event listener](https://developer.mozilla.org/docs/Web/API/Element/keydown_event)
to keep line breaks in sync with a clean content structure following the
[line break matching white-space rule](#line-break-matching-white-space-rule).

### deactivate()

```ts
deactivate()
```

Removes the `contenteditable` attribute from your element.

Deactivates the now unnecessary
[keydown event listener](https://developer.mozilla.org/docs/Web/API/Element/keydown_event).
