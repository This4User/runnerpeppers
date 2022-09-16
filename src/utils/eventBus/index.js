const subscriptions = {};

export const subscribe = (eventName, callback) => {
	if (!subscriptions[eventName]) {
		subscriptions[eventName] = new Set();
	}

	const callbacks = subscriptions[eventName];
	callbacks.add(callback);

	return () => {
		callbacks.delete(callback);

		if (callbacks.size === 0) {
			delete subscriptions[eventName];
		}
	};
};

export const unsubscribe = (eventName, callback) => {
	const callbacks = subscriptions[eventName];
	callbacks.delete(callback);

	if (callbacks.size === 0) {
		delete subscriptions[eventName];
	}

};

export const broadcast = (eventName, ...args) => {
	if (subscriptions[eventName]) {
		const callbacks = subscriptions[eventName];

		callbacks.forEach(callback => callback(...args));
	}
};