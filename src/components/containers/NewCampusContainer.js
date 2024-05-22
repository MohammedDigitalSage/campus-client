import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { addCampusThunk } from '../../store/thunks';
import NewCampusView from '../views/NewCampusView';

class NewCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: "",
      address: "",
      description: "",
      redirect: false, 
      redirectId: null
    };
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    let campus = {
        name: this.state.name,
        address: this.state.address,
        description: this.state.description,
        campusImg: this.state.campusImg
    };
    
    // Add new campus to back-end database
    let newCampus = await this.props.addCampus(campus);

    // Update state, and trigger redirect to show the new campus
    try {
    this.setState({
      name: "",
      address: "",
      description: "",
      redirect: true, 
      redirectId: newCampus.id
    });
  }
  catch (err) {
    console.error(err);
    alert("Provide correct information");
  }
}

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new campus input form
  render() {
    // Redirect to new campus' page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewCampusView
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}      
        />
      </div>          
    );
  }
}

const mapDispatch = (dispatch) => {
    return({
        addCampus: (campus) => dispatch(addCampusThunk(campus)),
    })
}

export default connect(null, mapDispatch)(NewCampusContainer);