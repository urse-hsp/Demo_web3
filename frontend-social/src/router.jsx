import React, { memo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Store from "./models";

// Router
import Index from "@/components/index/index.jsx";
import Topic from "@/components/topic/index.jsx";
import Us from "@/components/about/index.jsx";
import Node from "@/components/node/index.jsx";
import Attribute from "@/components/attribute/index.jsx";
import Address from "@/components/address/index.jsx";
import Topics from "@/components/topics/index.jsx";
import Replys from "@/components/replys/index.jsx";

function MyRouter() {
	return (
		<BrowserRouter>
			<Store>
				<Routes>
					{/* New */}
					<Route path="/" element={<Index />}></Route>
					<Route path="/t/:hash" element={<Topic />}></Route>
					<Route path="/n/:node" element={<Node />} />
					<Route path="/a/:address" element={<Attribute />}></Route>
					<Route path="/about" element={<Us />}></Route>
					<Route path="/topics/:address" element={<Topics />}></Route>
					<Route path="/replys/:address" element={<Replys />}></Route>
					<Route path="*" element={<Address />} />
				</Routes>
			</Store>
		</BrowserRouter>
	);
}

export default memo(MyRouter);
