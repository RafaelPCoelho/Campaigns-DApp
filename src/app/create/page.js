
export default function Home() {
    return (
        <>
            <div className="container">
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3 nt-5">Create a new donation page</h1>
                <p className="lead">Create a new donation page for your non-profit organization.</p>
                <p>Fill the forms to including your campaign</p>
                <hr className="my-4" />
                <div className="col-6">
                    <div className="form-floating mb-3">
                        <input type="text" id="title" className="form-control" />
                        <label htmlFor="title">Title</label>
                    </div>
                    <div className="form-floating mb-3">
                        <textarea id="description" className="form-control"/>
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" id="imageUrl" className="form-control" />
                        <label htmlFor="imageUrl">Image URL</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" id="videoUrl" className="form-control" />
                        <label htmlFor="videoUrl">Video URL</label>
                    </div>
                    <div className="col-6 mb-3">
                        <button type="button" className="btn btn-primary col-6 p-3">Save</button>
                        </div>
                        <div className="alert alert-success p-3 col-6" role="alert">Campaign registered successfully!</div>

                </div>
            </div>
        </>
    );
}
