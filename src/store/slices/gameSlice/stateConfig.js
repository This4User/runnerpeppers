import {
	END, IN_GAME, INIT_END,
	INIT_ERROR, INIT_START,
	LOADING_ASSETS, LOADING_ASSETS_END,
	LOADING_ERROR, LOOSE, PAUSED, WIN
} from "./consts";

export const stateConfig = {
	pending: LOADING_ASSETS,
	loading_assets: [LOADING_ASSETS_END, LOADING_ERROR],
	loading_assets_end: INIT_START,
	init_start: [INIT_END, INIT_ERROR],
	init_end: IN_GAME,
	in_game: [PAUSED, LOOSE, WIN, END],
	loose: IN_GAME,
	paused: IN_GAME
};