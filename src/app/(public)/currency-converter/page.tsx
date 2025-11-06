import CurrencyConverter from "@/components/currency-converter/CurrencyConverter";

const CurrencyConverterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8 flex justify-center items-center">
        <CurrencyConverter />
      </div>
    </div>
  );
};

export default CurrencyConverterPage;
