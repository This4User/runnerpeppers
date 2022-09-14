class SwipesTracker {
	addTargetElement(targetElement) {
		this.target = targetElement;
		this.target.addEventListener("touchstart", this.handleTouchStart);
		this.target.addEventListener("touchmove", this.handleTouchMove);
		this.target.addEventListener("touchend", this.handleTouchEnd);
		this.target.addEventListener("mousedown", this.handleTouchStart);
		this.target.addEventListener("mousemove", this.handleTouchMove);
		this.target.addEventListener("mouseup", this.handleTouchEnd);
	}

	handleTouchStart = (e) => {
		e.preventDefault();
		if (e.type === "mousedown") {
			this.xDown = e.clientX;
		} else {
			this.xDown = e.touches[0].clientX;
		}
	};

	addLeftSwipeEvent(event) {
		this.leftSwipeEvent = event;
	}

	addRightSwipeEvent(event) {
		this.rightSwipeEvent = event;
	}

	handleTouchMove = (e) => {
		e.preventDefault();
		let xUp;
		if (e.type === "mousemove") {
			xUp = e.clientX;
		} else {
			xUp = e.touches[0].clientX;
		}
		this.xDiff = this.xDown - xUp;
	};

	handleTouchEnd = () => {
		if (this.xDiff > 0) {
			console.log("Left");
			this.leftSwipeEvent();
		} else {
			console.log("Right");
			this.rightSwipeEvent();
		}
	};
}

export default new SwipesTracker();