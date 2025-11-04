"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CostCalculator from "./CostCalculator";

interface CostCalculatorModalProps {
  children: React.ReactNode;
}

const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Building Cost Calculator</DialogTitle>
        </DialogHeader>
        <CostCalculator />
      </DialogContent>
    </Dialog>
  );
};

export default CostCalculatorModal;
