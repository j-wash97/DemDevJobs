const ErrorAlert = props => (
    <div className="alert alert-danger mt-3 mx-2">{props.error}</div>
);

const SuccessAlert = props => (
    <div className="alert alert-success mt-3 mx-2">{props.error}</div>
);

const CompGroup = props => {
    const compOptions = props.companies.map(company => (
        <option key={company._id} value={company._id}>{company.name}</option>
    ));

    return (
        <div>
            <label htmlFor="company">Company</label>
            <select required name="company" id="company" className="form-control">
                <option disabled selected hidden>Please Select a Company First</option>
                {compOptions}
            </select>
        </div>
    );
};

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

const PostingList = props => {
    const postingNodes = props.postings.map(posting => (
        <a href="#" className="list-group-item list-group-item-action col" data-toggle="modal" data-target="#postingEdit"
            data-title={posting.title}
            data-level={posting.level}
            data-category={posting.category}
            data-location={posting.location_id}
            data-company={posting.company_id}
            data-salary={posting.salary}
            data-link={posting.link}
            data-description={posting.description}
            data-id={posting._id}
            key={posting._id}
        >
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{posting.title}</h5>
                    <h6 className="card-subtitle mb-2">{posting.company}</h6>
                    <h6 className="card-subtitle mb-2">{posting.location}</h6>
                    <h6 className="card-subtitle mb-2">Created {moment(posting.date).fromNow()}</h6>
                </div>
            </div>
        </a>
    ));
    
    return (
        <div className="list-group col">
            {postingNodes}
        </div>
    );
};

const CompanyList = props => {
    const companyNodes = props.companies.map(company => (
        <a href="#" className="list-group-item list-group-item-action col" data-toggle="modal" data-target="#companyEdit"
            data-name={company.name}
            data-contact={company.contact}
            data-id={company._id}
            key={company._id}
        >
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{company.name}</h5>
                    <h6 className="card-subtitle mb-2">{company.contact}</h6>
                    <h6 className="card-subtitle mb-2">Created {moment(company.createdDate).fromNow()}</h6>
                </div>
            </div>
        </a>
    ));
    
    return (
        <div className="list-group col">
            {companyNodes}
            <form className="list-group-item col"
                action="/submitCompany"
                id="companyForm"
                name="companyForm"
                onSubmit={handleCompSubmit}
            >
                <legend>Add New Company</legend>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input className="form-control" type="text" name="name" id="name" placeholder="Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="contact">Contact Info</label>
                    <input className="form-control" type="text" name="contact" id="contact" placeholder="Name: ... Email: ... Phone: ..."/>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Add" className="btn btn-primary"/>
            </form>
            <div id="errorAlertComp"></div>
        </div>
    );
};

const JobSiteList = props => {
    const jobsiteNodes = props.jobSites.map(jobsite => (
        <a href="#" className="list-group-item list-group-item-action col" data-toggle="modal" data-target="#jobSiteEdit"
            data-name={jobsite.name}
            data-description={jobsite.description}
            data-company={jobsite.company_id}
            data-address={jobsite.address}
            data-id={jobsite._id}
            key={jobsite._id}
        >
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{jobsite.name}</h5>
                    <h6 className="card-subtitle mb-2">{jobsite.company}</h6>
                    <h6 className="card-subtitle mb-2">{jobsite.address}</h6>
                    <h6 className="card-subtitle mb-2">{jobsite.description}</h6>
                    <h6 className="card-subtitle mb-2">Created {moment(jobsite.createdDate).fromNow()}</h6>
                </div>
            </div>
        </a>
    ));

    const companyOptions = props.companies.map(company => (
        <option value={company._id}>{company.name} - {company.contact}</option>
    ));
    
    return (
        <div className="list-group col">
            {jobsiteNodes}
            <form className="list-group-item col"
                action="/submitJobSite"
                id="jobSiteForm"
                name="jobSiteForm"
                onSubmit={handleSiteSubmit}
            >
                <legend>Add New Location</legend>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input className="form-control" type="text" name="name" id="name" placeholder="Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <select required className="form-control" name="company" id="company">
                        <option value="" disabled selected hidden>Company</option>
                        {companyOptions}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input className="form-control" type="text" name="address" id="address" placeholder="Address"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" className="form-control" placeholder="Description"/>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Add" className="btn btn-primary"/>
            </form>
            <div id="errorAlertJob"></div>
        </div>
    );
};

const titleBarLinks = <ul className="navbar-nav" id="titleBarLinks">
        <li className="nav-item"><a className="nav-link" href="/">View Jobs</a></li>
        <li className="nav-item active"><a className="nav-link" href="/user">Account</a></li>
        <li className="nav-item"><a className="nav-link" href="/submit">Submit</a></li>
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

const handlePostEdit = e => {
    e.preventDefault();

    $('#postingEdit').modal('hide');

    sendAjax(
        'POST',
        $('#postEditForm').attr('action'),
        $('#postEditForm').serialize(),
        getData,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditComp'))
    );

    return false;
};

const handleCompSubmit = e => {
    e.preventDefault();

    if ($('#companyForm').find('#name').val() == '') {
        ReactDOM.render(<ErrorAlert error='A name is required' />, document.querySelector('#errorAlertComp'));
        return false;
    }

    sendAjax(
        'POST',
        $('#companyForm').attr('action'),
        $('#companyForm').serialize(),
        getData,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertComp'))
    );

    return false;
};

const handleCompEdit = e => {
    e.preventDefault();

    if ($('#compEditForm').find('#name').val() == '') {
        ReactDOM.render(<ErrorAlert error='A name is required' />, document.querySelector('#errorAlertEditComp'));
        return false;
    }

    $('#companyEdit').modal('hide');

    sendAjax(
        'POST',
        $('#compEditForm').attr('action'),
        $('#compEditForm').serialize(),
        getData,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditComp'))
    );

    return false;
};

const handleSiteSubmit = e => {
    e.preventDefault();

    if ($('#jobSiteForm').find('#name').val() == '') {
        ReactDOM.render(<ErrorAlert error='A name is required' />, document.querySelector('#errorAlertJob'));
        return false;
    }

    if ($('#jobSiteForm').find('#company').val() == '' || $('#jobSiteForm').find('#company').val() == null) {
        ReactDOM.render(<ErrorAlert error='A company is required' />, document.querySelector('#errorAlertJob'));
        return false;
    }

    if ($('#jobSiteForm').find('#address').val() == '') {
        ReactDOM.render(<ErrorAlert error='An address is required' />, document.querySelector('#errorAlertJob'));
        return false;
    }

    sendAjax(
        'POST',
        $('#jobSiteForm').attr('action'),
        $('#jobSiteForm').serialize(),
        getData,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertJob'))
    );

    return false;
};

const handleSiteEdit = e => {
    e.preventDefault();

    if ($('#jobEditForm').find('#name').val() == '') {
        ReactDOM.render(<ErrorAlert error='A name is required' />, document.querySelector('#errorAlertEditJob'));
        return false;
    }

    if ($('#jobEditForm').find('#company').val() == '' || $('#jobEditForm').find('#company').val() == null) {
        ReactDOM.render(<ErrorAlert error='A company is required' />, document.querySelector('#errorAlertEditJob'));
        return false;
    }

    if ($('#jobEditForm').find('#address').val() == '') {
        ReactDOM.render(<ErrorAlert error='An address is required' />, document.querySelector('#errorAlertEditJob'));
        return false;
    }

    $('#jobSiteEdit').modal('hide');

    sendAjax(
        'POST',
        $('#jobEditForm').attr('action'),
        $('#jobEditForm').serialize(),
        getData,
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditJob'))
    );

    return false;
};

const handlePassChange = e => {
    e.preventDefault();

    if ($('#changeForm').find('#old').val() == '' || $('#changeForm').find('#pass').val() == '' || $('#changeForm').find('#pass2').val() == '') {
        ReactDOM.render(<ErrorAlert error='All fields are required'/>, document.querySelector('#errorAlertPass'));
        return false;
    }

    if ($('#changeForm').find('#pass').val() !== $('#changeForm').find('#pass2').val()) {
        ReactDOM.render(<ErrorAlert error='Passwords do not match'/>, document.querySelector('#errorAlertPass'));
        return false;
    }

    sendAjax(
        'POST',
        $('#changeForm').attr('action'),
        $('#changeForm').serialize(),
        res => ReactDOM.render(<SuccessAlert error={res.message}/>, document.querySelector('#errorAlertPass')),
        res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertPass'))
    );

    return false;
};

const handleLocations = () => sendAjax(
    'GET',
    '/jobSites',
    $.param({ company: $('#compGroup').find('#company').val() }),
    res => ReactDOM.render(<LocGroup locations={res.jobSites}/>, document.querySelector('#locGroup')),
    () => ReactDOM.render(<LocGroup locations={[]}/>, document.querySelector('#locGroup'))
);

const getPostings = () => sendAjax(
    'GET',
    '/owned',
    null,
    response => ReactDOM.render(<PostingList postings={response.postings} />, document.querySelector('#postingPane')),
    () => ReactDOM.render(<PostingList postings={[]} />, document.querySelector('#postingPane'))
);

const getJobSites = (res, companies) => sendAjax(
    'GET',
    '/jobSites',
    null,
    response => {
        getPostings();
        return ReactDOM.render(<JobSiteList jobSites={response.jobSites} companies={companies} csrf={res.csrfToken} />, document.querySelector('#jobsitePane'), () => $('#jobEditForm').find('#company').append($('#jobSiteForm').find('#company').find('option[value=""] ~ option').clone()));
    },
    () => {
        getPostings();
        return ReactDOM.render(<JobSiteList jobSites={[]} companies={companies} csrf={res.csrfToken} />, document.querySelector('#jobsitePane'), () => $('#jobEditForm').find('#company').append($('#jobSiteForm').find('#company').find('option[value=""] ~ option').clone()));
    }
);

const getCompanies = res => sendAjax(
    'GET',
    '/companies',
    null,
    response => {
        $('#jobEditForm').find('#company').empty();
        getJobSites(res, response.companies);
        return ReactDOM.render(<CompanyList companies={response.companies} csrf={res.csrfToken} />, document.querySelector('#companyPane'));
    },
    () => {
        $('#jobEditForm').find('#company').empty();
        getJobSites(res, []);
        return ReactDOM.render(<CompanyList companies={[]} csrf={res.csrfToken} />, document.querySelector('#companyPane'));
    }
);

const getData = () => sendAjax(
    'GET',
    '/getToken',
    null,
    getCompanies
); 

window.onload = () => {
    ReactDOM.render(titleBarLinks, document.querySelector('#linkList'));

    $('#changeForm').submit(handlePassChange);
    $('#postEditForm').submit(handlePostEdit);
    $('#compEditForm').submit(handleCompEdit);
    $('#jobEditForm').submit(handleSiteEdit);
    
    getData();

    $('#postingEdit').on('show.bs.modal', function (e) {
        $('#errorAlertEditPost').empty();

        const action = $(e.relatedTarget);
        const title = action.data('title');
        const level = action.data('level');
        const category = action.data('category');
        const location = action.data('location');
        const company = action.data('company');
        const salary = action.data('salary');
        const link = action.data('link');
        const description = action.data('description');
        const id = action.data('id');

        const modal = $(this);
        modal.find('#company').off('change');
        modal.find('#company').change(handleLocations);

        sendAjax(
            'GET',
            '/companies',
            null,
            response => ReactDOM.render(<CompGroup companies={response.companies} />, document.querySelector('#compGroup'), () => {
                modal.find('#company').val(company);
                return handleLocations();
            }),
            () => ReactDOM.render(<CompGroup companies={[]} />, document.querySelector('#compGroup'), () => ReactDOM.render(<LocGroup locations={[]}/>, document.querySelector('#locGroup')))
        );

        modal.find('#postingEditLabel').text(`Edit ${title}`);
        modal.find('#title').val(title);
        modal.find('#level').val(level);
        modal.find('#category').val(category);
        modal.find('#salary').val(salary);
        modal.find('#link').val(link);
        modal.find('#description').val(description);
        modal.find('input[name=_id]').val(id);

        modal.find('.btn-primary').unbind().click(e => $('#postEditForm').submit());
        modal.find('.btn-danger').unbind().click(e => sendAjax(
                'POST',
                $('#postEditForm').attr('action'),
                `${$('#postEditForm').serialize()}&remove=true`,
                getData,
                res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditComp'))
            ));
    });

    $('#companyEdit').on('show.bs.modal', function (e) {
        $('#errorAlertEditComp').empty();
        
        const action = $(e.relatedTarget);
        const name = action.data('name');
        const contact = action.data('contact');
        const id = action.data('id');

        const modal = $(this);
        modal.find('#companyEditLabel').text(`Edit ${name}`);
        modal.find('#name').val(name);
        modal.find('#contact').val(contact);
        modal.find('input[name=_id]').val(id);

        modal.find('.btn-primary').unbind().click(e => $('#compEditForm').submit());
        modal.find('.btn-danger').unbind().click(e => sendAjax(
                'POST',
                $('#compEditForm').attr('action'),
                `${$('#compEditForm').serialize()}&remove=true`,
                getData,
                res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditComp'))
            ));
    });

    $('#jobSiteEdit').on('show.bs.modal', function (e) {
        $('#errorAlertEditJob').empty();

        const action = $(e.relatedTarget);
        const name = action.data('name');
        const description = action.data('description');
        const company = action.data('company');
        const address = action.data('address');
        const id = action.data('id');

        const modal = $(this);
        modal.find('#jobSiteEditLabel').text(`Edit ${name}`);
        modal.find('#name').val(name);
        modal.find('#description').val(description);
        modal.find('#company').val(company);
        modal.find('#address').val(address);
        modal.find('input[name=_id]').val(id);
        
        modal.find('.btn-primary').unbind().click(e => $('#jobEditForm').submit());
        modal.find('.btn-danger').unbind().click(e => sendAjax(
                'POST',
                $('#jobEditForm').attr('action'),
                `${$('#jobEditForm').serialize()}&remove=true`,
                getData,
                res => ReactDOM.render(<ErrorAlert error={JSON.parse(res.responseText).error}/>, document.querySelector('#errorAlertEditJob'))
            ));
    });
};