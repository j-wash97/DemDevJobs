const ErrorAlert = props => (
    <div className="alert alert-danger mt-3 mx-2">{props.error}</div>
);

const SuccessAlert = props => (
    <div className="alert alert-success mt-3 mx-2">{props.error}</div>
);

const LocGroup = props => {
    const locOptions = props.locations.map(location => (
        <option key={location._id} value={location._id}>{location.name}</option>
    ));

    return (
        <div>
            <label htmlFor="location">Location</label>
            <select required name="location" id="location" className="form-control">
                <option disabled selected hidden>Please Select a Company First</option>
                {locOptions}
            </select>
        </div>
    );
};

const titleBarLinks = <ul className="navbar-nav" id="titleBarLinks">
        <li className="nav-item"><a className="nav-link" href="/">View Jobs</a></li>
        <li className="nav-item"><a className="nav-link" href="/user">Account</a></li>
        <li className="nav-item active"><a className="nav-link" href="/submit">Submit</a></li>
        <li className="nav-item"><a className="nav-link" href="/logout">Logout</a></li>
    </ul>;

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

const handleSubmit = e => {
    e.preventDefault();

    sendAjax(
        'POST',
        $('#submitForm').attr('action'),
        $('#submitForm').serialize(),
        res => ReactDOM.render(<SuccessAlert error={res.message}/>, document.querySelector('#errorAlert')),
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlert'))
    );

    return false;
};

const handleLocations = () => sendAjax(
    'GET',
    '/jobSites',
    $.param({ company: $('#submitForm').find('#company').val() }),
    res => ReactDOM.render(<LocGroup locations={res.jobSites}/>, document.querySelector('#locGroup')),
    () => ReactDOM.render(<LocGroup locations={[]}/>, document.querySelector('#locGroup'))
);

window.onload = () => {
    ReactDOM.render(titleBarLinks, document.querySelector('#linkList'));

    $('#submitForm').submit(handleSubmit);
    $('#submitForm').find('#company').change(handleLocations);
    handleLocations();
};