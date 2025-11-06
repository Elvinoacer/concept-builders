"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

interface CurrencyOption {
  value: string;
  label: string;
}

const currencyOptions: CurrencyOption[] = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "KES", label: "KES - Kenyan Shilling" },
];

const CurrencyConverter = () => {
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get("amount");
  const [amount, setAmount] = useState<number>(
    initialAmount ? parseFloat(initialAmount) : 1
  );
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [currentBaseCurrency, setCurrentBaseCurrency] = useState<string>("USD");
  const [result, setResult] = useState<string | null>(null);
  const [rateText, setRateText] = useState<string>("Exchange rate: -");
  const [lastUpdatedText, setLastUpdatedText] =
    useState<string>("Last updated: -");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExchangeRates = async (baseCurrency: string) => {
    setLoading(true);
    setError(null);
    setResult("Fetching latest rates...");

    try {
      const response = await fetch(`${API_URL}${baseCurrency}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }
      const data = await response.json();
      setExchangeRates(data.rates);
      setCurrentBaseCurrency(baseCurrency);
      setLastUpdatedText(`Last updated: ${new Date().toLocaleTimeString()}`);
    } catch (err: any) {
      console.error("Error fetching exchange rates:", err);
      setError(
        "Error fetching exchange rates. Please check your connection and try again."
      );
      setResult("Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates(fromCurrency);
  }, [fromCurrency]);

  const convertCurrency = () => {
    setError(null);
    const parsedAmount = parseFloat(amount.toString());

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      setResult(null);
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Please select different currencies for conversion");
      setResult(null);
      return;
    }

    if (!exchangeRates || fromCurrency !== currentBaseCurrency) {
      fetchExchangeRates(fromCurrency);
      setResult("Fetching latest exchange rates...");
      return;
    }

    const rate = exchangeRates[toCurrency];
    if (!rate) {
      setError("Exchange rate not available for selected currency");
      setResult(null);
      return;
    }

    const convertedAmount = (parsedAmount * rate).toFixed(2);
    const formattedAmount = formatCurrency(parsedAmount, fromCurrency);
    const formattedConvertedAmount = formatCurrency(
      parseFloat(convertedAmount),
      toCurrency
    );

    setResult(
      `<strong>${formattedAmount} = ${formattedConvertedAmount}</strong>`
    );
    setRateText(`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, toCurrency, exchangeRates]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-lg w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 xs:p-5 sm:p-6 text-center">
        <div className="flex items-center justify-center gap-2 xs:gap-3 mb-1 xs:mb-2">
          <div className="w-8 h-8 xs:w-10 xs:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 xs:w-5 xs:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L5 13V15L9 13.5V15H15V13.5L21 15V13L15 11.5V10.5L21 9Z" />
            </svg>
          </div>
          <h1 className="text-xl xs:text-2xl font-semibold leading-tight">
            Currency Converter
          </h1>
        </div>
        <p className="opacity-90 text-xs xs:text-sm">
          Real-time exchange rates at your fingertips
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4 xs:p-5 sm:p-6">
        {/* Amount Input */}
        <div className="mb-4 xs:mb-5">
          <label
            htmlFor="amount"
            className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-xs xs:text-sm"
          >
            Amount
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 xs:left-4 text-blue-600 z-10">
              <svg
                className="w-4 h-4 xs:w-5 xs:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L5 13V15L9 13.5V15H15V13.5L21 15V13L15 11.5V10.5L21 9Z" />
              </svg>
            </div>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full py-2.5 xs:py-3 pl-10 xs:pl-12 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg xs:rounded-xl text-sm xs:text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        {/* Currency Selection */}
        <div className="flex flex-col items-center justify-between my-4 xs:my-5 relative">
          {/* From Currency */}
          <div className="flex-1 w-full mb-4 xs:mb-5">
            <label
              htmlFor="from"
              className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-xs xs:text-sm"
            >
              From Currency
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 xs:left-4 text-blue-600 z-10">
                <svg
                  className="w-4 h-4 xs:w-5 xs:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <select
                id="from"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full py-2.5 xs:py-3 pl-10 xs:pl-12 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg xs:rounded-xl text-sm xs:text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234361ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "12px",
                }}
              >
                {currencyOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            className="bg-gradient-to-r from-purple-700 to-pink-500 text-white border-none rounded-full w-10 h-10 xs:w-12 xs:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg z-10 my-2 xs:my-0 transform hover:scale-110 hover:rotate-180 active:scale-95"
            id="swap"
            aria-label="Swap currencies"
            onClick={swapCurrencies}
          >
            <svg
              className="w-5 h-5 xs:w-6 xs:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
            </svg>
          </button>

          {/* To Currency */}
          <div className="flex-1 w-full mt-4 xs:mt-5">
            <label
              htmlFor="to"
              className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-xs xs:text-sm"
            >
              To Currency
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 xs:left-4 text-blue-600 z-10">
                <svg
                  className="w-4 h-4 xs:w-5 xs:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <select
                id="to"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full py-2.5 xs:py-3 pl-10 xs:pl-12 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg xs:rounded-xl text-sm xs:text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234361ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "12px",
                }}
              >
                {currencyOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center my-4">
            <div className="inline-block border-3 border-gray-200 border-l-blue-600 rounded-full w-8 h-8 xs:w-10 xs:h-10 animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-xs xs:text-sm">
              Fetching latest exchange rates...
            </p>
          </div>
        )}

        {/* Convert Button */}
        <button
          className="w-full py-2.5 xs:py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg xs:rounded-xl shadow-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl active:scale-100 text-sm xs:text-base min-h-[44px] xs:min-h-[48px]"
          onClick={convertCurrency}
          disabled={loading}
        >
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Convert Currency
        </button>

        {/* Result Display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg xs:rounded-xl p-4 xs:p-5 mt-4 xs:mt-5 text-center text-base xs:text-lg min-h-[80px] xs:min-h-[100px] flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
          {result ? (
            <div
              dangerouslySetInnerHTML={{ __html: result }}
              className="text-gray-900 dark:text-gray-100 font-medium text-lg xs:text-xl"
            />
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
              Enter amount and select currencies
            </div>
          )}
          <div className="flex flex-col xs:flex-row justify-between w-full mt-3 text-xs xs:text-sm text-gray-600 dark:text-gray-300 gap-1 xs:gap-2">
            <span className="break-words">{rateText}</span>
            <span className="break-words">{lastUpdatedText}</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mt-3 xs:mt-4 text-xs xs:text-sm bg-red-100 dark:bg-red-900/20 p-2 xs:p-3 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center p-3 xs:p-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <p>Powered by ExchangeRate-API | Rates update every 24 hours</p>
      </div>

      {/* Quick Actions - Mobile Only */}
      <div className="xs:hidden p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex gap-2">
          <button
            onClick={() => setAmount(100)}
            className="flex-1 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            $100
          </button>
          <button
            onClick={() => setAmount(500)}
            className="flex-1 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            $500
          </button>
          <button
            onClick={() => setAmount(1000)}
            className="flex-1 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            $1000
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
