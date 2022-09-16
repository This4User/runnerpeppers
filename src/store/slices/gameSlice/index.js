import {createSlice} from "@reduxjs/toolkit";
import {
	END, IN_GAME, INIT_END,
	INIT_ERROR, INIT_START,
	LOADING_ASSETS, LOADING_ASSETS_END,
	LOADING_ERROR, LOOSE, PAUSED,
	PENDING, WIN
} from "./consts";

const initialState = {
	current: PENDING,
};

export const gameStateSlice = createSlice({
	name: "gameState",
	initialState,
	reducers: {
		updateState: (state, action) => {
			switch (action.payload) {
				case LOADING_ASSETS:
					if (state.current === PENDING) {
						state.current = LOADING_ASSETS;
					}
					break;
				case LOADING_ASSETS_END:
					if (state.current === LOADING_ASSETS) {
						state.current = LOADING_ASSETS_END;
					}
					break;
				case LOADING_ERROR:
					if (state.current === LOADING_ASSETS) {
						state.current = LOADING_ERROR;
					}
					break;
				case INIT_START:
					if (state.current === LOADING_ASSETS_END) {
						state.current = INIT_START;
					}
					break;
				case INIT_END:
					if (state.current === INIT_START) {
						state.current = INIT_END;
					}
					break;
				case INIT_ERROR:
					if (state.current === INIT_START) {
						state.current = INIT_ERROR;
					}
					break;
				case IN_GAME:
					if (state.current === INIT_END || state.current === PAUSED) {
						state.current = IN_GAME;
					}
					break;

				case PAUSED:
					if (state.current === IN_GAME) {
						state.current = PAUSED;
					}
					break;

				case LOOSE:
					if (state.current === IN_GAME) {
						state.current = LOOSE;
					}
					break;

				case WIN:
					if (state.current === IN_GAME) {
						state.current = WIN;
					}
					break;

				case END:
					if (state.current === LOOSE || state.current === WIN) {
						state.current = END;
					}
					break;
			}
		}
	},
});

export const updateGameState = (newState) => (dispatch) => {
	dispatch(gameStateSlice.actions.updateState(newState));
};

export default gameStateSlice.reducer;