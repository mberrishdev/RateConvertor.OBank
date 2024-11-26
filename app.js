const API_PARAMS = {
    RequestId: "30f6c3a7-52a8-4849-b646-ede04de26d9a",
    ClientId: 123,
    ChannelId: 1001010,
    ExchangeType: 1,
    RateConversionType: 2
};

const checkLoginStatus = () => {
    const loginState = localStorage.getItem('loginState');
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (loginState === 'loggedIn' && username === 'admin' && password === 'admin') {
        document.querySelector('.login-form').classList.add('hidden');

        window.location.href = 'deal-list.html';
    } else {
        document.querySelector('.login-form').classList.remove('hidden');
    }
}

// Handle login button click
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials and log in if correct
    if (username === 'admin' && password === 'admin') {
        // Save credentials and login state to localStorage
        localStorage.setItem('loginState', 'loggedIn');
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        document.querySelector('.login-form').classList.add('hidden');
    } else {
        alert('Invalid credentials!');
    }
});

window.addEventListener('load', checkLoginStatus);