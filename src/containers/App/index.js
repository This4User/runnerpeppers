import "./index.css";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import {broadcast} from "../../utils/eventBus";
import {IN_GAME, PAUSED, RESTART, START} from "../../store/slices/gameSlice/consts";
import {updateGameState} from "../../store/slices/gameSlice";

function App() {
	const root = useRef(null);
	const dispatch = useDispatch();
	const gameState = useSelector((state) => state.game.current);
	const distance = useSelector((state) => Math.floor(state.game.distance));

	useEffect(() => {
		let game;
		import("../../controllers/game")
			.then((module) => {
				game = module.default;
				game.addTarget(root.current);
				game.initGame();
			});

		return () => {
			if (game) game.destroyGame();
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
				<button onClick={(e) => {
					e.stopPropagation();
					if (gameState === IN_GAME) {
						dispatch(updateGameState(PAUSED));
						broadcast(PAUSED);
					} else if (gameState === PAUSED) {
						dispatch(updateGameState(IN_GAME));
						broadcast(START);
					}
				}}>
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
