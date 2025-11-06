"use client";

import {
  Dialog,
  DialogClose,
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
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-[90vw] sm:w-[90vw] sm:h-[90vh] md:max-w-[85vw] md:w-[85vw] md:h-[85vh] lg:max-w-[80vw] lg:w-[80vw] lg:h-[80vh] xl:max-w-[75vw] xl:w-[75vw] xl:h-[75vh] 2xl:max-w-[70vw] 2xl:w-[70vw] 2xl:h-[70vh] overflow-hidden p-0 border-0">
        <DialogHeader className="p-4 xs:p-5 sm:p-6 pb-0 sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Building Cost Calculator
          </DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4 xs:p-5 sm:p-6 bg-gray-50 dark:bg-gray-900">
          <CostCalculator />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CostCalculatorModal;
