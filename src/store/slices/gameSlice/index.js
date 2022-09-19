import {createSlice} from "@reduxjs/toolkit";
import {
	PENDING
} from "./consts";
import {stateConfig} from "./stateConfig";

const initialState = {
	current: PENDING,
	distance: 0
};

export const gameStateSlice = createSlice({
	name: "gameState",
	initialState,
	reducers: {
		updateState: (state, action) => {
			const allowedStates = stateConfig[state.current];
			const nextState = action.payload;
			if (Array.isArray(allowedStates)) {
				allowedStates.forEach(stateName => {
					if (stateName === nextState) state.current = nextState;
				});
			} else {
				if (allowedStates === nextState) state.current = nextState;
			}

			console.log(state.current);
		},

		updateDistance: (state, action) => {
			if (action.payload !== 0) {
				state.distance += action.payload;
			} else {
				state.distance = 0;
			}
		}
	},
});

export const {updateDistance} = gameStateSlice.actions;

export const updateGameState = (newState) => (dispatch) => {
	dispatch(gameStateSlice.actions.updateState(newState));
};

export default gameStateSlice.reducer;