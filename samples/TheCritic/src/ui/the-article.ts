export class TheArticle extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `<style>
		:host {
		  display: flex;
		  flex-direction: column;
		  padding: 10px;
		}

		textarea {
			width: 100%;
			flex:1;
		}
	  </style>
	  <textarea></textarea>
	  <button id="critique">Critique</button>
	`;

	const critique = root.getElementById("critique");
	critique?.addEventListener("click", (event) => {
		const textarea = root.querySelector("textarea");
		const critiqueEvent = new CustomEvent("critique", {
			detail: {
				text: textarea?.value
			},
			composed: true
		});
		this.dispatchEvent(critiqueEvent);
	});
	}
}
