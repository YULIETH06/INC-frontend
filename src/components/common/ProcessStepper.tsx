import {
    Step,
    StepButton,
    Stepper,
} from "@mui/material";

// Información visual de una etapa del proceso.
export interface ProcessStep {
    label: string;
    completed?: boolean;
    disabled?: boolean;
}

interface ProcessStepperProps {
    steps: ProcessStep[];
    activeStep: number;
    onStepChange: (step: number) => void;
    alternativeLabel?: boolean;
}

// Stepper reutilizable para procesos divididos por etapas.
const ProcessStepper = ({
    steps,
    activeStep,
    onStepChange,
    alternativeLabel = true,
}: ProcessStepperProps) => {
    return (
        <Stepper
            nonLinear
            activeStep={activeStep}
            alternativeLabel={alternativeLabel}
        >
            {steps.map((step, index) => (
                <Step
                    key={`${step.label}-${index}`}
                    completed={
                        step.completed ?? false
                    }
                    disabled={
                        step.disabled ?? false
                    }
                >
                    <StepButton
                        onClick={() =>
                            onStepChange(index)
                        }
                    >
                        {step.label}
                    </StepButton>
                </Step>
            ))}
        </Stepper>
    );
};

export default ProcessStepper;