import React, { Component } from 'react';

class CreateAlbum extends Component {
  // ToDo: refactor

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      pictures: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  // todo: refactor
  preparePictures = (e) => {

    let files = e.target.files;
    delete files.length;
    let _files = []

    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();

      reader.onloadend = ((file) => {
        console.log("$$$$$$$ file ", file);

        _files.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type
        });
        this.setState({
          pictures: _files
        });
      })(files[i]);

      reader.readAsDataURL(files[i]);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const album = {
      title: this.state.title,
      pictures: this.state.pictures
    }

    console.log("$$$$$$", album); // {title: '', pictures: [{file, name, size, type }]}
    
    this.props.createAlbumFun(album);

    this.setState({
      title: '',
      pictures: ''
    });

    document.getElementById('upload-pictures').value = null;
  }
  render() {
    return (

      <div className="container pagecontainer">

        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          <div className="form-group">
            <label for="title" className="col-sm-2 control-label"></label>
            <div className="input-group col-sm-8">
              <div className="input-group-addon"><i className="glyphicon glyphicon glyphicon-user"></i></div>
              <input type="text"
                className="form-control"
                name="title"
                onChange={this.handleChange}
                value={this.state.title}
                placeholder="Album Title"
                required
              >
              </input>
            </div>
          </div>



          <div className="form-group">
            <label for="pictures" className="col-sm-2 control-label"></label>
            <div className="input-group col-sm-8">
              <div className="input-group-addon"><i className="glyphicon glyphicon glyphicon-picture"></i></div>
              <input type="file"
                className="form-control"
                id="upload-pictures"
                name="pictures"
                onChange={this.preparePictures}
                key={this.state.inputKey}
                placeholder="Album Pictures"
                multiple
              >

              </input>
            </div>
          </div>


          <label className="col-sm-2 control-label"></label>
          <button className="btn btn-primary col-sm-8"> Create Album </button>

        </form>
      </div>
    )
  }
}

export default CreateAlbum;