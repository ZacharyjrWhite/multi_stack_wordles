/// <reference types="svelte" />

declare global {
	namespace svelteHTML {
		interface IntrinsicElements {
			[key: string]: any;
		}
		interface HTMLAttributes<T> {
			[key: string]: any;
		}
	}
}

export {};

