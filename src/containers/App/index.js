import "./index.css";
import {useEffect, useRef} from "react";

function App() {
	const root = useRef(null);

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
	});

	return (
		<div
			className="App"
			ref={root}
		>
			<div
				className="game"
			>

			</div>
		</div>
	);
}

export default App;
