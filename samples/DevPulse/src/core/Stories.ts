export class Stories {
	private static instance: Stories;

	private stories: Map<number, unknown> = new Map<number, unknown>();

	private constructor() { }
	public static getInstance(): Stories {
		if (!Stories.instance) {
			Stories.instance = new Stories();
		}
		return Stories.instance;
	}

	private get(id: number): unknown {
		return this.stories.get(id);
	}
	private add(
		id: number,
		story: {
			[key: string]: unknown;
		}
	): void {
		this.stories.set(id, {
			...(this.stories.get(id) || {}),
			...story,
		});
	}
	static get(id: number): unknown {
		return Stories.getInstance().get(id);
	}
	static add(
		id: number,
		story: {
			[key: string]: unknown;
		}
	): void {
		Stories.getInstance().add(id, story);
	}
	static getAll(): unknown[] {
		return Array.from(Stories.getInstance().stories.values());
	}
}


