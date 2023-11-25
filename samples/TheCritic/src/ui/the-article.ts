export class TheArticle extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `<style>
		:host {
		  display: block;
		  padding: 10px;
		}
	  </style>
	  <textarea rows="10"></textarea>
	  <button>Critique</button>
	`;
	}
}
