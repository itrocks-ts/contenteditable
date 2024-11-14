
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

### Line break matching white-space rule

The line break characters inserted in your `contenteditable` element
depend on its `white-space` style attribute:
- `pre`, `pre-line` or `pre-wrap`: inserts a `\n` character,
- other `white-space` values result result in a `<br>` element.

## API

The following functions are publicly available in the `ContentEditable` class.

### ContentEditable() constructor

```ts
new ContentEditable(element)
```

Applies the `@itrocks/contenteditable` feature to an element.

Calls [activate()](#activate) for initialization.

Starts a [mutation observer](http://developer.mozilla.org/docs/Web/API/MutationObserver):
- automatically call [deactivate()](#deactivate) when the `contenteditable` attribute is removed,
- automatically call [activate()](#activate) when the `contenteditable` attribute is re-added.

#### Parameters

- `element` An [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) to apply the feature to.

### activate()

```ts
activate()
```

Sets the `contenteditable` attribute on your element if it's not already set,

Ensures the element ends with a technical trailing line break following the
[line break matching white-space rule](#line-break-matching-white-space-rule).

Adds the `data-trailing-br` attribute to indicate that a trailing line break character is part of
the text content but not its value.
This attribute is removed if you remove `[contenteditable]` or call [deactivate()](#deactivate).

Enables a [keydown event listener](https://developer.mozilla.org/docs/Web/API/Element/keydown_event)
to keep line breaks in sync with a clean content structure following the
[line break matching white-space rule](#line-break-matching-white-space-rule).

### deactivate()

```ts
deactivate()
```

Removes the `contenteditable` attribute from your element.

If the edited text does not end with a line break:
- removes the technical trailing line break,
- removes the `data-trailing-br` attribute.

Deactivates the now unnecessary
[keydown event listener](https://developer.mozilla.org/docs/Web/API/Element/keydown_event).
