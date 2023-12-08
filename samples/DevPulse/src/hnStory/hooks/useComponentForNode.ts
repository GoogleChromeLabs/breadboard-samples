import { OutputNodeData, OutputNodeIds } from "~/sw/types"

const Fallback = "Hidden"

const NodeIdMap: Map<string, OutputNodeIds> = new Map()
NodeIdMap.set("searchResultData", OutputNodeIds.searchResultData)
NodeIdMap.set("summary", OutputNodeIds.summary)
NodeIdMap.set("storyData", OutputNodeIds.storyData)

const useComponentForNode = (data: OutputNodeData): OutputNodeIds | typeof Fallback => {
	return NodeIdMap.get(data["node"]) || Fallback
}

export default useComponentForNode;
