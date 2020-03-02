window.onload = () => {
    const form = $('#submitForm');

    form.submit( e => {
        e.preventDefault();        
        
        const data = form.serialize();
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/addPosting');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader ('Accept', 'application/json');
        xhr.onload = () => {
            const response = JSON.parse(xhr.response);
            
            if (response.message) {
                if (response.id) {
                    $('#response').remove();
                    form.after($(`<div id="response" class="alert alert-danger" role="alert">${response.message}</div>`));
                }
                else {
                    $('#response').remove();
                    form.after($(`<div id="response" class="alert alert-success" role="alert">${response.message}</div>`));
                }
            }
        };
        xhr.send(data);

        return false;
    });
};