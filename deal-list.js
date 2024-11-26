function displayDeals(deals) {
    const dealListContainer = document.getElementById('dealListContainer');
    dealListContainer.innerHTML = '';

    deals.forEach(deal => {
        const dealItem = document.createElement('div');
        dealItem.classList.add('deal-item');
        dealItem.innerHTML = `
            <p><strong>სტატუსი:</strong> ${deal.status}</p>
            <p><strong>თანხა:</strong> ${deal.buyAmount} ${deal.buyCurrency} = ${deal.sellAmount} ${deal.sellCurrency}</p>
            <p><strong>კურსი:</strong> 1 ${deal.buyCurrency} = ${deal.exchangeRate} ${deal.sellCurrency}</p>
            <p><strong>თარიღი:</strong> ${new Date(deal.dateCreated).toLocaleString()}</p>
        `;

        // If the deal is awaiting client, add confirm and cancel buttons
        if (deal.status === 'Awaiting Client') {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'დადასტურება';
            confirmButton.classList.add('confirm-btn');
            confirmButton.addEventListener('click', () => confirmDeal(deal.requestId));

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'გაუქმება';
            cancelButton.classList.add('cancel-btn');
            cancelButton.addEventListener('click', () => cancelDeal(deal.requestId));

            dealItem.appendChild(confirmButton);
            dealItem.appendChild(cancelButton);
        }

        dealListContainer.appendChild(dealItem);
    });
}

function confirmDeal(dealId) {
    const deals = JSON.parse(localStorage.getItem('deals')) || [];
    const deal = deals.find(deal => deal.requestId === dealId);
    
    if (deal) {
        
        const apiUrl = `https://treasury-d41.tbcde.loc/operationapi/v1/Agree/${dealId}`;

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                deal.status = 'Agreed';

                localStorage.setItem('deals', JSON.stringify(deals));

                displayDeals(deals);

                console.log('Deal successfully confirmed!');
            } else {
                alert('Failed to confirm the deal. Please try again later.');
            }
        })

        displayDeals(deals);
    } else {
        console.error('Deal not found');
    }
}


function cancelDeal(dealId) {
    const deals = JSON.parse(localStorage.getItem('deals')) || [];
    const deal = deals.find(deal => deal.requestId === dealId);
    
    if (deal) {
        
        const apiUrl = `https://treasury-d41.tbcde.loc/operationapi/v1/Cancel/${dealId}`;

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                deal.status = 'cancelled';

                localStorage.setItem('deals', JSON.stringify(deals));

                displayDeals(deals);

                console.log('Deal successfully confirmed!');
            } else {
                alert('Failed to cancel the deal. Please try again later.');
            }
        })

        displayDeals(deals);
    } else {
        console.error('Deal not found');
    }
}

window.addEventListener('load', () => {
    const existingDeals = JSON.parse(localStorage.getItem('deals')) || [];
    displayDeals(existingDeals);
});
