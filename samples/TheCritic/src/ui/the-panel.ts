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
		<button id="save">Save</button>
	  </div>
	`;

		root.querySelector("#save")?.addEventListener("click", () => {
			const nameEl = <HTMLInputElement>root.querySelector("#name");
			const personaEl = <HTMLTextAreaElement>root.querySelector("#persona")
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
