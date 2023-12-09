/* eslint-disable @typescript-eslint/no-explicit-any */
export type CategoriseNodesHook = {
	searchResultData: any[];
	summarisationData: any[];
	debugData: any[];
};

const useCategoriseNodes = (dataObject: any): CategoriseNodesHook => {

	const searchResultData: any[] = [];
	const summarisationData: any[] = [];
	const debugData: any[] = [];

	dataObject.map((d: { node: string; }) => {
		if (d.node === "searchResultData") searchResultData.push(d);
		else if (d.node === "summary") summarisationData.push(d);
		else if (d.node === "storyData") debugData.push(d);
	});

	return {
		searchResultData,
		summarisationData,
		debugData
	}
};

export default useCategoriseNodes;