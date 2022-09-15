import { nanoid } from "@reduxjs/toolkit";

export default class AbstractFactory {
	storage = [];

	addCreatorFunction = (creator) => {
		this.creator = creator;
	};

	getItem = (name, options) => {
		let items = this.storage.find(item => item.name === name);

		if (items) {
			this.storage = this.storage.filter(item => item.name !== name);
			const item = items.array[Math.floor(Math.random() * items.length)];
			items.array = items.array.filter(currentItem => currentItem.id !== item.id);
			this.storage.push(items);

			return item;
		} else {
			return {
				id: nanoid(),
				item: this.creator(...options),
			};
		}
	};

	returnItem(name, item) {
		let items = this.storage.find(item => item.name === name);

		if (items) {
			this.storage.find(item => item.name === name).array.push(item);
		} else {
			const newItems = {
				name,
				array: [ item ],
			};

			this.storage.push(newItems);
		}
	}
}

/*
const storage = [ {
	name: "apple",
	array: [ 1, 2, 3, 4, 5, 6, 7 ],
} ];
const items = storage.find(item => item.name === "apple");

items.array.push("rawrawrawr");

console.log(storage);*/
