import { set } from 'mongoose';
import { ReactElement, useState } from 'react'

function useMultistepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(1);

  function next() {
    setCurrentStepIndex(i => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    })
  }

  function back() {
    setCurrentStepIndex(i => {
      if (i <= 0) return i;
      return i - 1;
    })
  }

  function goTo(index: number) {
    setCurrentStepIndex(index)
  }

  const isLastStep = currentStepIndex === steps.length - 1;
  

  const isFirstStep =  currentStepIndex === 0;



  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
    steps,
    isFirstStep,
    isLastStep
  }
}

export default useMultistepForm
