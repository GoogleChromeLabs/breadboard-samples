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
	  </style>
	  <slot name="critics"></slot>
	  <div>
		<input type="text" id="name" placeholder="Name" />
		<input type="text" id="persona" placeholder="Persona" />
		<button id="save">Save</button>
	  </div>
	`;

		root.querySelector("#save")?.addEventListener("click", () => {
			const nameEl = <HTMLInputElement>root.querySelector("#name");
			const personaEl = <HTMLInputElement>root.querySelector("#persona")
			this.addCritic(nameEl.value, personaEl.value);

			nameEl.value = "";
			personaEl.value = "";
		})
	}

	addCritic(name: string, persona: string) {
		const criticElement = document.createElement("a-critic");
		criticElement.slot = "critics";
		criticElement.setAttribute("name", name);
		criticElement.setAttribute("persona", persona);

		this.appendChild(criticElement);
	}
}
