export default class AbstractFactory {
	storage = [];

	getItem(name, options) {
		let items = this.storage.find(item => item.name === name);

		if (items && items.array.length) {
			const item = items.array[items.array.length - 1];
			items.array.pop();

			if (item) {
				return item;
			} else {
				return this.createItem(options);
			}
		} else {
			return this.createItem(options);
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
