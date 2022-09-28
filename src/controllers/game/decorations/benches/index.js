import AbstractDecoration from "../abstractDecoration";
import spritesFactory, {BENCH} from "../../spritesFactory";
import {broadcast, subscribe} from "../../../../utils/eventBus";
import {ADD_TREES} from "../trees";

export const ADD_BENCH = "add_bench";

class Benches extends AbstractDecoration {
	name = BENCH;

	constructor(textures, stage, sceneHeight, sceneWidth) {
		super(textures, stage, sceneHeight, sceneWidth);
		subscribe(ADD_BENCH, () => {
			const leftBench = spritesFactory.getItem(this.name, this.textures);
			leftBench.item.x = 100 - 54;
			leftBench.item.y = -84 * 5;
			leftBench.item.zIndex = 10;

			const rightBench = spritesFactory.getItem(this.name, this.textures);
			rightBench.item.x = this.sceneWidth - 100;
			rightBench.item.y = -84 * 5;

			this.decorationsStorage[0].push(leftBench);
			this.decorationsStorage[1].push(rightBench);

			this.stage.addChild(leftBench.item);
			this.stage.addChild(rightBench.item);
			broadcast(ADD_TREES);
		});
	}
}

export default Benches;