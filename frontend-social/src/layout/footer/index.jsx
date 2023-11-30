import "./index.scss";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer id="footer" className="footer">
			<div className="container">
				<div className="flex justify">
					<div>
						<h2>Social 是一个跨链交流聚合器</h2>
						<p>你可以选择任何一条公链永久记录你的作品</p>
					</div>
					<div>
						<Link to="/about">About Social</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
