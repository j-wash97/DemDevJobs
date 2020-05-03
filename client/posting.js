// l is JS boolean set up in the main layout, indicating whether the user is logged in or not
const titleBarLinks = l ? <ul className="navbar-nav" id="titleBarLinks">
        <li className="nav-item active"><a className="nav-link" href="/">View Jobs</a></li>
        <li className="nav-item"><a className="nav-link" href="/user">Account</a></li>
        <li className="nav-item"><a className="nav-link" href="/submit">Submit</a></li>
        <li className="nav-item"><a className="nav-link" href="/logout">Logout</a></li>
    </ul> :
    <ul className="navbar-nav" id="titleBarLinks">
        <li className="nav-item active"><a className="nav-link" href="/">View Jobs</a></li>
        <li className="nav-item"><a className="nav-link" href="/login">Login/Signup</a></li>
    </ul>;

window.onload = () => {
    ReactDOM.render(titleBarLinks, document.querySelector('#linkList'));

    const datePosted = $('#datePosted');
    datePosted.text(moment(datePosted.data('date')).format('[Posted] MMM Do, YYYY'));
};