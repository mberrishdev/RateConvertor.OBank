// Define constants for fixed parameters
const API_PARAMS = {
    RequestId: "30f6c3a7-52a8-4849-b646-ede04de26d9a",
    ClientId: 123,
    ChannelId: 1001010,
    ExchangeType: 1,
    RateConversionType: 2
};

// Fetch Exchange Rate from the API
const fetchExchangeRate = (buyCurrency, sellCurrency, amount) => {
    const url = `https://treasury-d41.tbcde.loc/operationapi/v2/ExchangeRates/GetExchangeRate?RequestId=${API_PARAMS.RequestId}&ClientId=${API_PARAMS.ClientId}&ChannelId=${API_PARAMS.ChannelId}&BuyCurrency=${buyCurrency}&SellCurrency=${sellCurrency}&ExchangeType=${API_PARAMS.ExchangeType}&Amount=${amount}&RateConversionType=${API_PARAMS.RateConversionType}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data.exchangeRate; // Returning the exchange rate from the API
        })
        .catch(error => {
            console.error("Error fetching exchange rate:", error);
            throw new Error("Failed to fetch exchange rate.");
        });
};

const calculateNewExchangeRate = (exchangeRate, amount) => {
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    const url = `https://treasury-d41.tbcde.loc/operationapi/v2/Deals/Calculate?BuyCurrency=${buyCurrency}&SellCurrency=${sellCurrency}&ExchangeRate=${exchangeRate}&Amount=${amount}&RateConversionType=${API_PARAMS.RateConversionType}&ExchangeType=${API_PARAMS.ExchangeType}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data.amount;
        })
        .catch(error => {
            console.error("Error fetching exchange rate:", error);
            throw new Error("Failed to fetch exchange rate.");
        });
};

// Handle amount input and dynamic exchange rate calculation
document.getElementById('amount').addEventListener('input', () => {
    const amount = document.getElementById('amount').value;
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    if (amount && !isNaN(amount) && amount > 0) {
        fetchExchangeRate(buyCurrency, sellCurrency, amount)
            .then(exchangeRate => {
                const calculatedAmount = (amount * exchangeRate).toFixed(2);
                document.getElementById('calculatedAmount').value = calculatedAmount;
                document.getElementById('exchangeRateMessage').textContent = `1 ${sellCurrency} = ${exchangeRate} ${sellCurrency}`;

                document.getElementById('newRate').value = exchangeRate;
            })
            .catch(error => {
                alert("Error fetching exchange rate.");
            });
    }
});

// Handle currency dropdown change
document.getElementById('buyCurrency').addEventListener('change', () => {
    const amount = document.getElementById('amount').value;
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    if (amount && !isNaN(amount) && amount > 0) {
        fetchExchangeRate(buyCurrency, sellCurrency, amount)
            .then(exchangeRate => {
                const calculatedAmount = (amount * exchangeRate).toFixed(2);
                document.getElementById('calculatedAmount').value = calculatedAmount;
                document.getElementById('exchangeRateMessage').textContent = `Exchange rate: ${exchangeRate}`;
            })
            .catch(error => {
                alert("Error fetching exchange rate.");
            });
    }
});

// Handle sell currency dropdown change
document.getElementById('sellCurrency').addEventListener('change', () => {
    const amount = document.getElementById('amount').value;
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    if (amount && !isNaN(amount) && amount > 0) {
        fetchExchangeRate(buyCurrency, sellCurrency, amount)
            .then(exchangeRate => {
                const calculatedAmount = (amount * exchangeRate).toFixed(2);
                document.getElementById('calculatedAmount').value = calculatedAmount;
                document.getElementById('exchangeRateMessage').textContent = `Exchange rate: ${exchangeRate}`;
            })
            .catch(error => {
                alert("Error fetching exchange rate.");
            });
    }
});

// When "Request New Rate" is clicked, show new rate section
document.getElementById('newRateBtn').addEventListener('click', () => {
    const amount = document.getElementById('amount').value;
    const calculatedAmount = document.getElementById('calculatedAmount').value;
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    if (amount && buyCurrency && sellCurrency) {

        document.getElementById('new-rate-amounts').textContent =
            `${amount} ${buyCurrency} = ${calculatedAmount} ${sellCurrency}`;

        // document.getElementById('newRate').

        // Show new rate section
        document.getElementById('newRateSection').classList.remove('hidden');
        document.querySelector('.currency-form').classList.add('hidden');

    } else {
        alert('Please enter valid amount and currencies first.');
    }
});

// Handle the custom exchange rate and calculate the new deal
document.getElementById('newRate').addEventListener('input', () => {
    const newRate = parseFloat(document.getElementById('newRate').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    if (newRate && !isNaN(newRate) && newRate > 0 && amount && !isNaN(amount)) {
        calculateNewExchangeRate(newRate, amount)
        .then(calculatedAmount => {
            document.getElementById('new-rate-amounts').textContent = `${amount} ${buyCurrency} = ${calculatedAmount} ${sellCurrency}`;
            document.getElementById('calculatedResultMessage').classList.remove('hidden');

            document.getElementById('dealResultSection').classList.remove('hidden');
        })
        .catch(error => {
            alert("Error fetching exchange rate.");
        });

        // Show deal result section
        document.getElementById('dealResultSection').classList.remove('hidden');
    } else {
        alert('Please enter a valid rate and amount.');
    }
});

document.getElementById('createDealBtn').addEventListener('click', () => {
    const amount = localStorage.getItem('amount');
    const buyCurrency = localStorage.getItem('buyCurrency');
    const sellCurrency = localStorage.getItem('sellCurrency');
    const newRate = parseFloat(document.getElementById('newRate').value);

    // Deal data to be stored
    const dealRequest = {
        requestId: "48a77e17-2063-4278-b97d-cfe09b3f86a2",
        clientId: 1,
        channelId: 1,
        branchId: 1,
        productId: 1,
        buyCurrency: buyCurrency,
        sellCurrency: sellCurrency,
        exchangeRate: newRate,
        buyAmount: amount,
        sellAmount: (amount * newRate).toFixed(2),
        exchangeType: 1,
        rateConversionType: 2,
        rateWeight: 1,
        buyAccountIBAN: "GE02TB1234567890987654",
        sellAccountIBAN: "GE02TB0987654321234567",
        dateCreated: new Date().toISOString()  // Add timestamp
    };

    console.log('Creating deal with the following details:', dealRequest);

    // Get existing deals from localStorage
    let existingDeals = JSON.parse(localStorage.getItem('deals')) || [];

    // Add the new deal to the list
    existingDeals.push(dealRequest);

    localStorage.setItem('deals', JSON.stringify(existingDeals));

    window.location.href = 'deal-list.html';
});
