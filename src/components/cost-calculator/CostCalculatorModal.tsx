"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CostCalculator from "./CostCalculator";

interface CostCalculatorModalProps {
  children: React.ReactNode;
}

const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-[90vw] sm:w-[90vw] sm:h-[90vh] md:max-w-[85vw] md:w-[85vw] md:h-[85vh] lg:max-w-[80vw] lg:w-[80vw] lg:h-[80vh] xl:max-w-[75vw] xl:w-[75vw] xl:h-[75vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Building Cost Calculator
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6 pt-4">
          <CostCalculator />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CostCalculatorModal;
