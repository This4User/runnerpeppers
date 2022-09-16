import {configureStore} from "@reduxjs/toolkit";
import gameStateSlice from "./slices/gameSlice";

export const store = configureStore({
	reducer: {
		game: gameStateSlice
	},
});
