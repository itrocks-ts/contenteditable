[![npm version](https://img.shields.io/npm/v/@itrocks/contenteditable?logo=npm)](https://www.npmjs.org/package/@itrocks/contenteditable)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/contenteditable)](https://www.npmjs.org/package/@itrocks/contenteditable)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/contenteditable?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/contenteditable)
[![issues](https://img.shields.io/github/issues/itrocks-ts/contenteditable)](https://github.com/itrocks-ts/contenteditable/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://discord.gg/WFPJjmUx)

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

Any content ending with a line break will have a trailing `<br>` added to ensure proper display in your browser.

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

### br()

```ts
br()
```

Determines and returns the current line break string used for your `contenteditable` element,
in accordance with the [line break matching white-space rule](#line-break-matching-white-space-rule).

### brNode()

```ts
brNode()
```

Creates a node that matches the current line break string.
Result is either a [TextNode](https://developer.mozilla.org/docs/Web/API/Document/createTextNode) containing '\n'
or an [HTMLBRElement](https://developer.mozilla.org/docs/Web/API/HTMLBRElement).

### deactivate()

```ts
deactivate()
```

Removes the `contenteditable` attribute from your element.

Deactivates the now unnecessary
[keydown event listener](https://developer.mozilla.org/docs/Web/API/Element/keydown_event).

If the value contains no line break, removes the trailing `<br>`.

### onKeyDown()

```ts
onKeyDown(event)
```

Handles the [keydown](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) event
for the `contenteditable` element, ensuring the correct behavior when the `'Enter'` key is pressed.
By default, this method determines the appropriate action for the `'Enter'` key
based on the library's implementation of line break management.

#### Extending `onKeyDown`

This method is designed to be extensible
using [Aspect-Oriented Programming (AOP)](https://en.wikipedia.org/wiki/Aspect-oriented_programming) principles.
Developers can intercept and augment the behavior of `onKeyDown` to customize keyboard event handling
while carefully managing execution priority relative to the library's default behavior.
This extension can be performed **before**, **after**, or even **instead of** the default behavior.

#### Why extend `onKeyDown` instead of adding a `keydown` listener?

1. **Control execution order:**  
   Adding a [`keydown`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
   event listener via `addEventListener` does not provide fine-grained control over execution priority
   relative to the library's built-in handling. Extending `onKeyDown` allows you to execute your logic either **before**,
   **after**, or **instead of** the library's processing of the event.

2. **Avoid unintended interference:**  
   Preventing the library's default `'Enter'` key behavior by stopping event propagation
   (`event.stopPropagation()` or `event.preventDefault()`)
   may inadvertently interfere with other components or listeners unrelated to this library.
   By extending `onKeyDown`, you ensure your changes are isolated and do not disrupt other listeners.

#### Example: Preventing multiline input using AOP

The following example demonstrates how to extend `onKeyDown` for a specific `ContentEditable` instance
to prevent the default behavior of the `'Enter'` key when the element does not have a `data-multiline` attribute:

```ts
const contentEditable = new ContentEditable(document.queryElement('#my-editable'))
const superOnKeyDown  = contentEditable.onKeyDown
contentEditable.onKeyDown = function (event: KeyboardEvent): void {
	if ((event.key === 'Enter') && !this.element?.hasAttribute('data-multiline')) {
		event.preventDefault()
		return
	}
	superOnKeyDown.call(this, event)
}
```

#### Key Points

- By overriding `onKeyDown`, you can implement custom behaviors tailored to your requirements.
- Ensure you call the original method (`superOnKeyDown`) when appropriate to preserve the default functionality,
  unless you intend to completely replace it.
- This approach provides precise control over execution order without impacting unrelated components or listeners.
- Using this pattern, multiple plugins can safely and independently modify the behavior of the same instance.

This makes it easier to apply different behaviors to individual `contentEditable` instances
without relying on inheritance or risking conflicts with other plugins.

### value()

```ts
value()
```

Returns the effective value of the edited content.
This corresponds to the `innerHTML` of the content,
excluding the trailing `<br>` added to display the final empty line in the browser
(see [Line break matching white-space rule](#line-break-matching-white-space-rule)).
