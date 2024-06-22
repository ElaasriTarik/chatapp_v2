function sendData() {
    const dataToSend = { name: 'John Doe', age: 30 };

    fetch('http://localhost:5000/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => JSON.stringify(response))
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}
sendData()