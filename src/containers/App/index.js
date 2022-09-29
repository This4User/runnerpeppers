import "./index.css";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {broadcast, subscribe} from "../../utils/eventBus";
import {IN_GAME, LOOSE, PAUSED, RESTART, START, UPDATE_DIFFICULT} from "../../store/slices/gameSlice/consts";
import {updateDistance, updateGameState, updateLife} from "../../store/slices/gameSlice";
import headerBackground from "../../assets/header-bg.svg";

function App() {
	const root = useRef(null);
	const game = useRef(null);
	const dispatch = useDispatch();
	const gameState = useSelector((state) => state.game.current);
	const life = useSelector((state) => state.game.life);
	const distance = useSelector((state) => Math.floor(state.game.distance));
	const [prevDistanceStep, setPrevDistanceStep] = useState(0);

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

		const unsubscribeUpdateLife = subscribe("update_life", (options) => {
			dispatch(updateLife(options));
		});

		return () => {
			if (game.current) game.current.destroyGame();
			unsubscribeUpdateState();
			unsubscribeUpdateDistance();
			unsubscribeUpdateLife();
		};
	}, []);

	useEffect(() => {
		if (Math.floor(distance / 100) > prevDistanceStep) {
			broadcast(UPDATE_DIFFICULT, 0.5);
			setPrevDistanceStep(Math.floor(distance / 100));
		}
	}, [distance]);

	useEffect(() => {
		if (life < 0) {
			broadcast("update_state", LOOSE);
		}
	}, [life]);

	return (
		<div
			className="App"
			ref={root}
		>
			<div
				className="game-header"
			>
				<div className="actions">
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
				<div className="info">
					<div className="info__number">
						{distance}
					</div>
					<div className="info__text">
						метры
					</div>
				</div>
				<div className="info">
					<div className="info__number">
						{life !== -1 ? life : 0}
					</div>
					<div className="info__text">
						жизни
					</div>
				</div>

				<img src={headerBackground} alt="header background"/>
			</div>
		</div>
	);
}

export default App;
