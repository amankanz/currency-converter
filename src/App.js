// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [inputAmount, setInputAmount] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");
  const [output, setOutput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API = `https://api.frankfurter.app/latest?amount=${inputAmount}&from=${currencyFrom}&to=${currencyTo}`;

  function handleInputAmount(value) {
    setInputAmount(value);
  }

  function handleCurrencyFrom(value) {
    setCurrencyFrom(value);
  }

  function handleCurrencyTo(value) {
    setCurrencyTo(value);
  }

  const currency = currencyTo;
  const newAmount = output[currency];

  console.log(newAmount);

  useEffect(
    function () {
      const controller = new AbortController();

      if (!inputAmount) return;
      setIsLoading(true);
      setError("");
      async function fetchCurrency() {
        try {
          const response = await fetch(API, { signal: controller.signal });

          if (!response.ok) throw new Error("Something went wrong");

          const data = await response.json();

          if (!data) throw new Error("Currency not available...");

          console.log(data);
          setOutput(data.rates);
        } catch (error) {
          setIsLoading(false);
          setError(error.message);
          console.log(error.message);

          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      fetchCurrency();

      return function () {
        controller.abort();
      };
    },
    [inputAmount, currencyFrom, currencyTo, API]
  );

  useEffect(
    function () {
      if (!inputAmount) return;

      return function () {
        setOutput(0);
      };
    },
    [inputAmount]
  );

  return (
    <div>
      <input
        type="text"
        value={!inputAmount ? "" : inputAmount}
        onChange={(e) => handleInputAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <select
        defaultValue="USD"
        onChange={(e) => handleCurrencyFrom(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="UGX">UGX</option>
      </select>
      <select
        defaultValue="EUR"
        onChange={(e) => handleCurrencyTo(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="UGX">UGX</option>
      </select>
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && <p>{!newAmount ? `OUTPUT` : newAmount}</p>}
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p>{message}</p>;
}

function Loader() {
  return <p>Loading...</p>;
}
