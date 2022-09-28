import spritesFactory, {TREE} from "../../spritesFactory";
import {subscribe} from "../../../../utils/eventBus";
import AbstractDecoration from "../abstractDecoration";

export const ADD_TREES = "add_trees";

class Trees extends AbstractDecoration {
	name = TREE;

	constructor(textures, stage, sceneHeight, sceneWidth) {
		super(textures, stage, sceneHeight, sceneWidth);
		subscribe(ADD_TREES, () => {
			const leftTree = spritesFactory.getItem(this.name, this.textures);
			leftTree.item.x = 100 - 54;
			leftTree.item.y = -84 * 6;
			leftTree.item.zIndex = 10;

			const rightTree = spritesFactory.getItem(this.name, this.textures);
			rightTree.item.x = this.sceneWidth - 100;
			rightTree.item.y = -84 * 6;

			this.decorationsStorage[0].push(leftTree);
			this.decorationsStorage[1].push(rightTree);

			this.stage.addChild(leftTree.item);
			this.stage.addChild(rightTree.item);
		});
	}
}

export default Trees;