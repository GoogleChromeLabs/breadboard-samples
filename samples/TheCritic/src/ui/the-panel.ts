import { ACritic } from './a-critic';
export class ThePanel extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `
	  <style>
		:host {
		  display: block;
		  padding: 10px;
		}

		div.config {
			display: flex;
			flex-direction: column;
		}
	  </style>
	  <slot name="critics"></slot>
	  <div class="config">
		<input type="text" id="name" placeholder="Name" />
		<textarea type="text" id="persona" placeholder="Persona"></textarea>
		<button id="add">Add</button>
	  </div>
	`;

		root.querySelector("#add")?.addEventListener("click", () => {
			const nameEl = <HTMLInputElement>root.querySelector("#name");
			const personaEl = <HTMLTextAreaElement>root.querySelector("#persona")
			this.addCritic(nameEl.value, personaEl.value);

			const critiqueEvent = new CustomEvent("criticadded", {
				detail: {
					name: nameEl.value,
					persona: personaEl.value
				},
				composed: true
			});
			this.dispatchEvent(critiqueEvent);

			nameEl.value = "";
			personaEl.value = "";
		})
	}

	get criticElements() {
		return this.querySelectorAll("a-critic");
	}

	get critics() {
		const els = this.querySelectorAll("a-critic") as NodeListOf<ACritic>;
		return Array.from(els).map(el => {
			return {
				id: el.id,
				name: el.name,
				persona: el.persona
			}
		});
	}

	addCritic(name: string, persona: string) {
		const criticElement = document.createElement("a-critic");
		criticElement.slot = "critics";
		criticElement.setAttribute("name", name);
		criticElement.setAttribute("persona", persona);

		this.appendChild(criticElement);
	}
}
