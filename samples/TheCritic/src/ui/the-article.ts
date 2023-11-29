export class TheArticle extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `<style>
		:host {
		  display: block;
		  padding: 10px;
		}

		textarea {
			display: block;
			width: 100%;
		}
	  </style>
	  <textarea rows="10"></textarea>
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
