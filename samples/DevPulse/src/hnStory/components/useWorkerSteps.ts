import { useCallback, useState } from "react";
import { InputSteps, addInputCollection } from "../inputSlice";
import { useAppDispatch } from "~/core/redux/hooks";
import { WorkerData } from "~/sw/types";

const useWorkerSteps = () => {
	const [stepNumber, setStepNumber] = useState<number>(0);
	const [inputSteps, setInputSteps] = useState<InputSteps>({});
	const dispatch = useAppDispatch();

	const addStep = (step: WorkerData) => {
		console.log("Adding step", stepNumber, step);
		setInputSteps((prev) => ({ ...prev, [stepNumber]: step }));
		setStepNumber((prev) => prev + 1);
	}

	const finalize = useCallback(() => {
		if (stepNumber === 0) {
			return;
		}
		console.log("Finalizing", inputSteps, stepNumber);
		const deepCopy = JSON.parse(JSON.stringify(inputSteps));
		dispatch(addInputCollection(deepCopy));
		setStepNumber(0);
		setInputSteps({});
	}, [stepNumber, inputSteps, dispatch])
	
	return {
		addStep,
		finalize
	}
};

export default useWorkerSteps;