import {createSlice} from "@reduxjs/toolkit";
import {
	PENDING, RESTART
} from "./consts";
import {stateConfig} from "./stateConfig";

const initialState = {
	current: PENDING,
	distance: 0,
	life: 3
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
		},

		updateLife: (state, action) => {
			if (action.payload !== RESTART) {
				state.life -= 1;
			} else {
				state.life = 3;
			}
		}
	},
});

export const {updateDistance, updateLife} = gameStateSlice.actions;

export const updateGameState = (newState) => (dispatch) => {
	dispatch(gameStateSlice.actions.updateState(newState));
};

export default gameStateSlice.reducer;