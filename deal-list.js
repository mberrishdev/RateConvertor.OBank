function displayDeals(deals) {
    const dealListContainer = document.getElementById('dealListContainer');
    dealListContainer.innerHTML = ''; // Clear previous list

    // Loop through each deal and create a list item for it
    deals.forEach(deal => {
        const dealItem = document.createElement('div');
        dealItem.classList.add('deal-item');
        dealItem.innerHTML = `
            <p><strong>Deal ID:</strong> ${deal.requestId}</p>
            <p><strong>Amount:</strong> ${deal.buyAmount} ${deal.buyCurrency}</p>
            <p><strong>Exchange Rate:</strong> ${deal.exchangeRate}</p>
            <p><strong>Calculated Amount:</strong> ${deal.sellAmount} ${deal.sellCurrency}</p>
            <p><strong>Date Created:</strong> ${new Date(deal.dateCreated).toLocaleString()}</p>
        `;
        dealListContainer.appendChild(dealItem);
    });
}

// Function to load and display deals when the page is loaded
window.addEventListener('load', () => {
    const existingDeals = JSON.parse(localStorage.getItem('deals')) || [];
    displayDeals(existingDeals);
});
