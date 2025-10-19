
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

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
  const initialAmount = searchParams.get('amount');
  const [amount, setAmount] = useState<number>(initialAmount ? parseFloat(initialAmount) : 1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [currentBaseCurrency, setCurrentBaseCurrency] = useState<string>("USD");
  const [result, setResult] = useState<string | null>(null);
  const [rateText, setRateText] = useState<string>("Exchange rate: -");
  const [lastUpdatedText, setLastUpdatedText] = useState<string>("Last updated: -");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExchangeRates = async (baseCurrency: string) => {
    setLoading(true);
    setError(null);
    setResult("Fetching latest rates...");

    try {
      const response = await fetch(`${API_URL}${baseCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      const data = await response.json();
      setExchangeRates(data.rates);
      setCurrentBaseCurrency(baseCurrency);
      setLastUpdatedText(`Last updated: ${new Date().toLocaleTimeString()}`);
    } catch (err: any) {
      console.error('Error fetching exchange rates:', err);
      setError('Error fetching exchange rates. Please check your connection and try again.');
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
      setError('Please enter a valid amount greater than 0');
      setResult(null);
      return;
    }

    if (fromCurrency === toCurrency) {
      setError('Please select different currencies for conversion');
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
      setError('Exchange rate not available for selected currency');
      setResult(null);
      return;
    }

    const convertedAmount = (parsedAmount * rate).toFixed(2);
    const formattedAmount = formatCurrency(parsedAmount, fromCurrency);
    const formattedConvertedAmount = formatCurrency(parseFloat(convertedAmount), toCurrency);

    setResult(`<strong>${formattedAmount} = ${formattedConvertedAmount}</strong>`);
    setRateText(`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, toCurrency, exchangeRates]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 text-center">
        <h1 className="text-2xl font-semibold mb-1 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-3xl">currency_exchange</span> Currency Converter
        </h1>
        <p className="opacity-90 text-sm">Real-time exchange rates at your fingertips</p>
      </div>
      
      <div className="p-6">
        <div className="mb-5">
          <label htmlFor="amount" className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-sm">
            <span className="material-symbols-outlined text-base align-bottom">attach_money</span> Amount
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-blue-600 z-10">attach_money</span>
            <input 
              type="number" 
              id="amount" 
              placeholder="Enter amount" 
              min="0" 
              step="0.01" 
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full py-3 pl-12 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between my-6 relative">
          <div className="flex-1 w-full">
            <div className="mb-5">
              <label htmlFor="from" className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-sm">From Currency</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-blue-600 z-10">flag</span>
                <select 
                  id="from" 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full py-3 pl-12 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234361ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 15px center',
                    backgroundSize: '15px',
                  }}
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <button 
            className="bg-gradient-to-r from-purple-700 to-pink-500 text-white border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg z-10 md:mx-4 my-4 md:my-0 transform rotate-90 md:rotate-0 hover:scale-110 hover:rotate-180" 
            id="swap" 
            aria-label="Swap currencies" 
            onClick={swapCurrencies}
          >
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
          
          <div className="flex-1 w-full">
            <div className="mb-5">
              <label htmlFor="to" className="block mb-2 font-medium text-gray-800 dark:text-gray-200 text-sm">To Currency</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-blue-600 z-10">flag</span>
                <select 
                  id="to" 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full py-3 pl-12 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg text-base transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234361ee' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 15px center',
                    backgroundSize: '15px',
                  }}
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="text-center my-4">
            <div className="inline-block border-4 border-gray-200 border-l-blue-600 rounded-full w-10 h-10 animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Fetching latest exchange rates...</p>
          </div>
        )}
        
        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl active:scale-100" id="convert" onClick={convertCurrency}>
          <span className="material-symbols-outlined">calculate</span> Convert Currency
        </button>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 mt-5 text-center text-lg min-h-[100px] flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
          {result ? <div dangerouslySetInnerHTML={{ __html: result }} className="text-gray-900 dark:text-gray-100" /> : <div className="text-gray-500 dark:text-gray-400">Enter amount and select currencies</div>}
          <div className="flex justify-between w-full mt-3 text-sm text-gray-600 dark:text-gray-300 flex-wrap gap-2">
            <span>{rateText}</span>
            <span>{lastUpdatedText}</span>
          </div>
        </div>
        
        {error && <div className="text-red-600 dark:text-red-400 text-center mt-4 text-sm bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
      </div>
      
      <div className="text-center p-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Powered by ExchangeRate-API | Rates update every 24 hours</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
