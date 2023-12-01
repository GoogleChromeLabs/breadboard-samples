export class ACritic extends HTMLElement {

	#root: ShadowRoot;

	static get observedAttributes() {
		return ['name', 'persona'];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'persona') {
			const personaElement = this.#root.querySelector(`#${name}`) as HTMLTextAreaElement;
			if (personaElement===null) return;

			personaElement.innerText = newValue;

		}
		this.#root.querySelector(`#${name}`)?.setAttribute('value', newValue);
	}

	get name() {
		return this.getAttribute('name');
	}

	set name(value) {
		if (value) {
			this.setAttribute('name', value);
		}
		else {
			this.removeAttribute('name');
		}
	}

	get persona() {
		return this.getAttribute('persona');
	}

	set persona(value) {
		if (value) {
			this.setAttribute('persona', value);
		}
		else {
			this.removeAttribute('persona');
		}
	}

	constructor() {
		super();
		this.#root = this.attachShadow({ mode: "open" });
		this.#root.innerHTML = `
	  <style>
		:host {
		  display: block;
		  padding: 10px;
		}

		details ::slotted(div:empty)) {
			display: none;
		}

		div.config {
			display: flex;
			flex-direction: column;
		}

		div.config input {
			flex: 1;
			width: 100%;
			display; block;
		}

	  </style>
		<div class="config">
			<input type=text id="name" value="${this.name}">
			<textarea id="persona">${this.persona}</textarea>
		</div>
		<div>
			<details>
				<summary>Response</summary>
				<slot name=response></slot>
			</details>
		</div>
	`;
	}
}
