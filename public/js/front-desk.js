const socket = io()

// Get the button element
const loadDataButton = document.getElementById('loadDataButton');

// Add event listener to the button
loadDataButton.addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Send an AJAX request to trigger the handleLoadDataRequest function
    fetch('/loadData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            return response.text();
        })
        .then(data => {
            // Update the content of the dataContainer div with the response from the server
            document.getElementById('dataContainer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function updateModeDisplay(mode) {
    document.getElementById('modeDisplay').textContent = mode
}


socket.on('raceModeChange', mode => {
    // Update mode display
    updateModeDisplay(mode)
})


