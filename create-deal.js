// Define constants for fixed parameters
const API_PARAMS = {
    RequestId: generateUUID(),
    ClientId: 4068718,
    ChannelId: 1001010,
    ExchangeType: 1,
    RateConversionType: 2
};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
                document.getElementById('exchangeRateMessage').textContent = `1 ${buyCurrency} = ${exchangeRate} ${sellCurrency}`;

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

document.getElementById('createDealBtn').addEventListener('click', async () => {
    const newRate = parseFloat(document.getElementById('newRate').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const calculatedAmount = parseFloat(document.getElementById('calculatedAmount').value);
    const buyCurrency = document.getElementById('buyCurrency').value;
    const sellCurrency = document.getElementById('sellCurrency').value;

    const dealRequest = {
        requestId: API_PARAMS.RequestId,
        clientId: API_PARAMS.ClientId,
        channelId: API_PARAMS.ChannelId,
        branchId: 1,
        productId: 1,
        buyCurrency: buyCurrency,
        sellCurrency: sellCurrency,
        exchangeRate: newRate,
        buyAmount: amount,
        sellAmount: calculatedAmount,
        exchangeType: API_PARAMS.ExchangeType,
        rateConversionType: API_PARAMS.RateConversionType,
        rateWeight: 1,
        buyAccountIBAN: "GE02TB1234567890987654",
        sellAccountIBAN: "GE02TB0987654321234567",
    };

    const response = await fetch('https://treasury-d41.tbcde.loc/operationapi/v2/deals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealRequest)
    });

    if (response.ok) {
        const apiResponse = await response.json(); // Assuming your API returns a JSON response

        // Prepare the deal model to store in localStorage
        const dealModel = {
            requestId: dealRequest.requestId,
            clientId: dealRequest.clientId,
            buyCurrency: dealRequest.buyCurrency,
            sellCurrency: dealRequest.sellCurrency,
            buyAccountIBAN: dealRequest.buyAccountIBAN,
            sellAccountIBAN: dealRequest.sellAccountIBAN,
            buyAmount: dealRequest.buyAmount,
            sellAmount: dealRequest.sellAmount,
            exchangeRate: dealRequest.exchangeRate,
            exchangeType: dealRequest.exchangeType,
            rateConversionType: dealRequest.rateConversionType,
            rateWeight: dealRequest.rateWeight,
            status: apiResponse.IsAutoConfirmed ? "Awaiting Client" : "ელოდება ბანკის დასტურს",
            dateCreated: new Date().toISOString(),
            isAutoConfirmed: apiResponse.IsAutoConfirmed
        };

        dealModel.status = "Awaiting Client";
        console.log('Deal model to be saved:', dealModel);

        let existingDeals = JSON.parse(localStorage.getItem('deals')) || [];

        existingDeals.push(dealModel);

        localStorage.setItem('deals', JSON.stringify(existingDeals));

        window.location.href = 'deal-list.html';
    } else {
        console.error('Error creating deal:', response.statusText);
        alert('There was an error creating the deal. Please try again.');
    }
});
