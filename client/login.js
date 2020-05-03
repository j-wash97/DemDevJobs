const ErrorAlert = props => (
    <div className="alert alert-danger mt-3 mx-2">{props.error}</div>
);

const sendAjax = (type, url, data, success, error) => {
    $.ajax({
        cache: false,
        type,
        url,
        data,
        dataType: 'json',
        success,
        error
    });
};

const handleLogin = e => {
    e.preventDefault();

    if ($('#loginForm').find('#user').val() == '' || $('#loginForm').find('#pass').val() == '') {
        ReactDOM.render(<ErrorAlert error='A username and password are required'/>, document.querySelector('#errorAlert'));
        return false;
    }

    sendAjax(
        'POST',
        $('#loginForm').attr('action'),
        $('#loginForm').serialize(),
        res => window.location = res.redirect,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlert'))
    );

    return false;
};

const handleSignup = e => {
    e.preventDefault();

    if ($('#signupForm').find('#user').val() == '' || $('#signupForm').find('#pass').val() == '' || $('#signupForm').find('#pass2').val() == '') {
        ReactDOM.render(<ErrorAlert error='All fields are required'/>, document.querySelector('#errorAlert'));
        return false;
    }

    if ($('#signupForm').find('#pass').val() !== $('#signupForm').find('#pass2').val()) {
        ReactDOM.render(<ErrorAlert error='Passwords do not match'/>, document.querySelector('#errorAlert'));
        return false;
    }

    sendAjax(
        'POST',
        $('#signupForm').attr('action'),
        $('#signupForm').serialize(),
        res => window.location = res.redirect,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlert'))
    );

    return false;
};

const titleBarLinks = <ul className="navbar-nav" id="titleBarLinks">
        <li className="nav-item"><a className="nav-link" href="/">View Jobs</a></li>
    </ul>;

window.onload = () => {
    ReactDOM.render(titleBarLinks, document.querySelector('#linkList'));

    $('#loginForm').submit(handleLogin);
    $('#signupForm').submit(handleSignup);
};