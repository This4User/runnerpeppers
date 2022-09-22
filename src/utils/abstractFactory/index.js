export default class AbstractFactory {
	storage = [];

	getItem(name, options) {
		let items = this.storage.find(item => item.name === name);

		if (items) {
			this.storage = this.storage.filter(item => item.name !== name);
			const item = items.array[Math.floor(Math.random() * items.array.length)];
			items.array = items.array.filter(currentItem => currentItem.id !== item.id);
			this.storage.push(items);

			return item;
		} else {
			return options ? this.createItem(options) : false;
		}
	};

	returnItem(name, item) {
		let items = this.storage.find(item => item.name === name);

		if (items) {
			items.array.push(item);
		} else {
			const newItems = {
				name,
				array: [item],
			};

			this.storage.push(newItems);
		}
	}

	createItem(options) {
		return {};
	}
}
