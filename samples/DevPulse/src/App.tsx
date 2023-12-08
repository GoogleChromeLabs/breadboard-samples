import React from "react";
import "./App.scss";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import MainLayout from "./layouts/main-layout";
import MainContent from "./components/main-content";

function App(): React.ReactElement {
	return (
		<>
			<MainLayout>
				<Header />
				<Sidebar />
				<MainContent />
			</MainLayout>
		</>
	);
}

export default App;
