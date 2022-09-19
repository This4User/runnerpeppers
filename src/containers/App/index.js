import "./index.css";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import {broadcast, subscribe} from "../../utils/eventBus";
import {IN_GAME, LOOSE, PAUSED, RESTART, START} from "../../store/slices/gameSlice/consts";
import {updateDistance, updateGameState} from "../../store/slices/gameSlice";

function App() {
	const root = useRef(null);
	const game = useRef(null);
	const dispatch = useDispatch();
	const gameState = useSelector((state) => state.game.current);
	const distance = useSelector((state) => Math.floor(state.game.distance));

	useEffect(() => {
		import("../../controllers/game")
			.then((module) => {
				game.current = module.default;
				game.current.addTarget(root.current);
				game.current.initGame();
			});

		const unsubscribeUpdateState = subscribe("update_state", (nextState) => {
			dispatch(updateGameState(nextState));
			broadcast(nextState);
		});

		const unsubscribeUpdateDistance = subscribe("update_distance", (length) => {
			dispatch(updateDistance(length));
		});

		return () => {
			if (game) game.current.destroyGame();
			unsubscribeUpdateState();
			unsubscribeUpdateDistance();
		};
	}, []);

	return (
		<div
			className="App"
			ref={root}
		>
			<div
				className="game-header"
			>
				{distance} м
				<button
					onClick={(e) => {
						e.stopPropagation();
						if (gameState === IN_GAME) {
							dispatch(updateGameState(PAUSED));
							broadcast(PAUSED);
						} else if (gameState === PAUSED) {
							dispatch(updateGameState(IN_GAME));
							broadcast(START);
						}
					}}
					disabled={gameState === LOOSE}
				>
					{
						gameState === IN_GAME ? "Пауза" : "Продолжить"
					}
				</button>
				<button
					onClick={() => {
						if (gameState !== IN_GAME) {
							broadcast(RESTART);
						}
					}}
					disabled={gameState === IN_GAME}
				>
					Занаво
				</button>
			</div>
		</div>
	);
}

export default App;
