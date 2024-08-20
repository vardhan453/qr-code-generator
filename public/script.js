document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const url = document.getElementById('url').value;
  
    fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
    .then(response => response.json())
    .then(data => {
      const qrCodeImage = document.getElementById('qrCodeImage');
  
      // Add a cache-busting query parameter to the image URL
      qrCodeImage.src = data.imageUrl + `?t=${new Date().getTime()}`;
      qrCodeImage.style.display = 'block';
  
      // Clear the input field
      document.getElementById('url').value = '';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  