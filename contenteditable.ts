
export default class ContentEditable
{

	isActive = false

	keyDownEventListener = (event: KeyboardEvent) => this.onKeyDown(event)

	mutationObserver: MutationObserver

	activate()
	{
		const element = this.element

		if (!element.hasAttribute('contenteditable')) {
			element.setAttribute('contenteditable', '')
		}

		if (!element.hasAttribute('data-trailing-br')) {
			element.appendChild(this.brNode())
			element.setAttribute('data-trailing-br', '')
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

	constructor(public element: HTMLElement)
	{
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

		const br     = this.br()
		let   text   = element.innerHTML
		let   update = false

		if ((br === '\n') && text.includes('<br>')) {
			text   = text.replaceAll('<br>', '\n')
			update = true
		}

		if (element.hasAttribute('contenteditable')) {
			element.removeAttribute('contenteditable')
		}
		if (
			element.hasAttribute('data-trailing-br')
			&& text.endsWith(br)
			&& !text.endsWith(br + br)
		) {
			element.removeAttribute('data-trailing-br')
			text   = text.slice(0, -br.length)
			update = true
		}

		if (update) {
			element.innerHTML = text
		}

		if (!this.isActive) return
		this.isActive = false

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
	}

}
