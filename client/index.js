window.onload = () => {
    let postings;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getAllPostings');    
    xhr.setRequestHeader ('Accept', 'application/json');
    xhr.onload = () => {
        const unsortedPostings = JSON.parse(xhr.response).postings
        postings = unsortedPostings.map((x, i) => { return { index: i, posting: x }}).sort((a,b) => b.posting.date - a.posting.date);
        
        for(let posting of postings) {
            let card = $('#mainContent').append(`<div class="col-sm-3 py-2">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <h6 class="card-subtitle mb-2 text-muted">${moment(posting.date).fromNow()}</h6>
                                                            <h5 class="card-title">${posting.posting.title}</h5>
                                                            <h6 class="card-subtitle mb-2 text-muted">${posting.posting.company}</h6>
                                                            <a href="${posting.posting.link}" class="card-link" target="_blank">Website Link</a>
                                                            <a href="#" class="stretched-link" data-toggle="modal" data-target="#postingDisplay" data-index="${posting.index}"></a>
                                                        </div>
                                                    </div>
                                                </div>`);
        }
    };
    xhr.send();

    $('#postingDisplay').on('show.bs.modal', e => {
        $('#postingDisplay').find('#view').prop('hidden', false);
        $('#postingDisplay').find('.modal-footer').prop('hidden', false);
        $('#postingDisplay').find('#update').prop('hidden', true);

        const action = $(e.relatedTarget);
        const postingData = postings.find(x => x.index === action.data('index'));

        let jobLevel, category;

        switch (postingData.posting.level) {
            case 0: jobLevel = 'Internship/Student';
                break;
            case 1: jobLevel = 'Entry'; 
                break;
            case 2: jobLevel = 'Mid'; 
                break;
            case 3: jobLevel = 'Senior'; 
                break;
        }

        switch (postingData.posting.category) {
            case 0: category = 'Art';
                break;
            case 1: category = 'Design'; 
                break;
            case 2: category = 'Engineering'; 
                break;
            case 3: category = 'Production'; 
                break;
        }

        $('#postingDisplayLabel').text(postingData.posting.title);
        $('#postingDisplay').find('#view').html(`<p><small class="text-muted">Posted ${moment(postingData.posting.date).format('MMMM D, YYYY')}</small><br/>
                                                <a href="${postingData.posting.link}" class="modal-link " target="_blank">Website Link</a></p>
                                                <dl class="row">
                                                    ${postingData.posting.company !== null ? `<dt class="col-3">Company</dt>
                                                    <dd class="col-9"><p>${postingData.posting.company}</p></dd>` : ''}
                                                    ${postingData.posting.location !== null ? `<dt class="col-3">Location</dt>
                                                    <dd class="col-9"><p>${postingData.posting.location}</p></dd>` : ''}
                                                    ${postingData.posting.contact !== null ? `<dt class="col-3">Contact</dt>
                                                    <dd class="col-9"><p>${postingData.posting.contact}</p></dd>` : ''}                                                    
                                                    <dt class="col-3">Job Level</dt>
                                                    <dd class="col-9"><p>${jobLevel}</p></dd>
                                                    <dt class="col-3">Category</dt>
                                                    <dd class="col-9"><p>${category}</p></dd>
                                                    ${postingData.posting.salary !== null ? `<dt class="col-3">Salary</dt>
                                                    <dd class="col-9"><p>$${postingData.posting.salary}</p></dd>` : ''}
                                                    ${postingData.posting.description !== null ? `<dt class="col-3">Description</dt>
                                                    <dd class="col-9"><p>${postingData.posting.description}</p></dd>` : ''}
                                                </dl>`);
        $('#postingDisplay').find('#updateForm').html(`<legend>Update Posting</legend>
                                                    <input type="hidden" id="index" name="index" value="${postingData.index}" />
                                                    <div class="form-group form-check">
                                                      <input type="checkbox" class="form-check-input" id="remove" name="remove" />
                                                      <label class="form-check-label" for="remove">Remove Posting</label>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="title">Title</label>
                                                        <input class="form-control" type="text" id="title" name="title" placeholder="Title" value="${postingData.posting.title}"/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="level">Level</label>
                                                        <select required class="form-control" id="level" name="level">
                                                            <option value="" disabled ${postingData.posting.level === null ? `selected `: ''}hidden>Level</option>
                                                            <option value="0" ${postingData.posting.level === 0 ? `selected `: ''}>Internship/Student</option>
                                                            <option value="1" ${postingData.posting.level === 1 ? `selected `: ''}>Entry</option>
                                                            <option value="2" ${postingData.posting.level === 2 ? `selected `: ''}>Mid</option>
                                                            <option value="3" ${postingData.posting.level === 3 ? `selected `: ''}>Senior</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="category">Category</label>
                                                        <select required class="form-control" id="category" name="category">
                                                            <option disabled ${postingData.posting.category === null ? `selected `: ''}hidden>Category</option>
                                                            <option value="0" ${postingData.posting.category === 0 ? `selected `: ''}>Art</option>
                                                            <option value="1" ${postingData.posting.category === 1 ? `selected `: ''}>Design</option>
                                                            <option value="2" ${postingData.posting.category === 2 ? `selected `: ''}>Engineering</option>
                                                            <option value="3" ${postingData.posting.category === 3 ? `selected `: ''}>Production</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="company">Company</label>
                                                        <input class="form-control" type="text" id="company" name="company" placeholder="Company" ${postingData.posting.company !== null ? `value="${postingData.posting.company}"`: ''}/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="location">Location</label>
                                                        <input class="form-control" type="text" id="location" name="location" placeholder="Location" ${postingData.posting.location !== null ? `value="${postingData.posting.location}"`: ''}/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="contact">Contact</label>
                                                        <textarea class="form-control" id="contact" name="contact" placeholder="Contact" rows="2" >${postingData.posting.contact !== null ? postingData.posting.contact : ''}</textarea>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="salary">Salary</label>
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text">$</span>
                                                            </div>
                                                            <input class="form-control" type="text" id="salary" name="salary" placeholder="Salary" ${postingData.posting.salary !== null ? `value="${postingData.posting.salary}"`: ''}/>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="link">Link</label>
                                                        <input class="form-control" type="url" pattern="https://.*" id="link" name="link" placeholder="Link" ${postingData.posting.link !== null ? `value="${postingData.posting.link}"`: ''}/>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="description">Description</label>
                                                        <textarea class="form-control" id="description" name="description" placeholder="Description" rows="10">${postingData.posting.description !== null ? postingData.posting.description : ''}</textarea>
                                                    </div>
                                                    <button type="submit" class="btn btn-primary">Update Posting</button>`);
    });

    $('#postingDisplay').find('button').click(e => {
        $('#postingDisplay').find('#view').prop('hidden', true);
        $('#postingDisplay').find('.modal-footer').prop('hidden', true);
        $('#postingDisplay').find('#update').prop('hidden', false);
    });

    const form = $('#updateForm');

    form.submit( e => {
        e.preventDefault();        
        
        const data = form.serialize();
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/updatePosting');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader ('Accept', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 204) {
                $('#response').remove();
                form.after($(`<div id="response" class="alert alert-success mt-4" role="alert">Posting has been updated</div>`));
            }
        };
        xhr.send(data);

        return false;
    });
};