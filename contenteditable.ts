
export class HTMLEditableElement extends HTMLElement
{
	constructor(public editable: ContentEditable) {
		super()
	}
}

export class ContentEditable
{

	element: HTMLEditableElement;

	isActive = false

	keyDownEventListener = (event: KeyboardEvent) => this.onKeyDown(event)

	mutationObserver: MutationObserver

	activate()
	{
		const element = this.element
		if (!element.hasAttribute('contenteditable')) {
			element.setAttribute('contenteditable', '')
		}

		if (this.isActive) return
		this.isActive = true

		element.addEventListener('keydown', this.keyDownEventListener)
	}

	br()
	{
		return getComputedStyle(this.element).whiteSpace.startsWith('pre')
			? '\n'
			: '<br>'
	}

	brNode()
	{
		return (this.br() === '\n')
			? document.createTextNode('\n')
			: document.createElement('br')
	}

	constructor(element: HTMLElement)
	{
		this.element = element as HTMLEditableElement
		this.element.editable = this
		this.activate()

		this.mutationObserver = new MutationObserver(mutations => mutations.forEach(mutation => {
			if ((mutation.type !== 'attributes') || (mutation.attributeName !== 'contenteditable')) return
			element.hasAttribute('contenteditable')
				? this.activate()
				: this.deactivate()
		}))
		this.mutationObserver.observe(element, { attributes: true })
	}

	deactivate()
	{
		const element = this.element
		if (element.hasAttribute('contenteditable')) {
			element.removeAttribute('contenteditable')
		}

		if (!this.isActive) return
		this.isActive = false

		const text = element.innerHTML
		if (text.endsWith('<br>') && !text.endsWith(this.br() + '<br>')) {
			element.innerHTML = text.slice(0, -4)
		}

		element.removeEventListener('keydown', this.keyDownEventListener)
	}

	onKeyDown(event: KeyboardEvent)
	{
		if (event.key !== 'Enter') return

		event.preventDefault()

		const selection = window.getSelection()
		if (!selection?.rangeCount) return

		const brNode = this.brNode()

		const range = selection.getRangeAt(0)
		range.deleteContents()
		range.insertNode(brNode)

		range.setStartAfter(brNode)
		range.collapse(true)
		selection.removeAllRanges()
		selection.addRange(range)

		const br      = this.br()
		const element = this.element
		const text    = element.innerHTML
		if (text.endsWith(br) && !text.endsWith(br + '<br>')) {
			element.appendChild(document.createElement('br'))
		}

		element.dispatchEvent(new Event('input'))
	}

	value()
	{
		let text = this.element.innerHTML
		return text.endsWith('<br>')
			? text.slice(0, -4)
			: text
	}

}
