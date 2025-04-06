import { useState, useEffect } from 'react';

function ExchangeDollar() {
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const roundedRate = Math.floor(data.rates?.COP); 
        setExchangeRate(roundedRate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }

    fetchExchangeRate();
  }, []);

  return exchangeRate;
}

export default ExchangeDollar;
