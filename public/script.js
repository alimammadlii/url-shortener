document.getElementById('url-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const url = document.getElementById('url-input').value;

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        if (data.shortUrl) {
            document.getElementById('short-url').innerHTML = `<strong>Shortened URL:</strong> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        } else {
            document.getElementById('short-url').innerHTML = `<strong>Error:</strong> ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('short-url').innerHTML = `<strong>Error:</strong> Could not shorten the URL.`;
    }
});