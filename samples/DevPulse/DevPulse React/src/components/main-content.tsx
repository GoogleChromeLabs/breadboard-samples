import WorkerComponent from "~/hnStory/components/WorkerComponent";
import ContentBox from "~/layouts/content-box";
import ContentGrid from "~/layouts/content-grid";

const MainContent = (): React.JSX.Element => {
	return (
		<ContentGrid>
			<ContentBox>
				<WorkerComponent />
			</ContentBox>
		</ContentGrid>
	);
};

export default MainContent;
