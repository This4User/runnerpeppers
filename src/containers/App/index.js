import "./index.css";
import {useEffect, useRef} from "react";

function App() {
	const root = useRef(null);

	useEffect(() => {
		let game;
		import("../../Game")
			.then((module) => {
				game = new module.Game(root.current);
			});
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
