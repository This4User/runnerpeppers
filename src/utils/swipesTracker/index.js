class SwipesTracker {
	isMouseDown = false;

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
		e.stopPropagation();
		if (e.type === "mousedown") {
			this.isMouseDown = true;
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
		e.stopPropagation();
		if (this.isMouseDown) {
			let xUp;
			if (e.type === "mousemove") {
				xUp = e.clientX;
			} else {
				xUp = e.touches[0].clientX;
			}

			this.xDiff = this.xDown - xUp;
		}
	};

	handleTouchEnd = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.isMouseDown = false;
		if (this.xDiff !== 0) {
			if (this.xDiff > 0) {
				this.leftSwipeEvent();
			} else {
				this.rightSwipeEvent();
			}
		}
		this.xDiff = 0;
	};
}

export default new SwipesTracker();