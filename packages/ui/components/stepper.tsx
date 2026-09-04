export interface StepperProps { steps: string[]; currentStep: number; }

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Progress">
      {steps.map((step, index) => {
        const state = index < currentStep ? 'complete' : index === currentStep ? 'active' : 'upcoming';
        return (
          <li className={`stepper-item stepper-item-${state}`} key={step} aria-current={state === 'active' ? 'step' : undefined}>
            <span className="stepper-index">{index < currentStep ? '✓' : index + 1}</span>
            <span className="stepper-label">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}