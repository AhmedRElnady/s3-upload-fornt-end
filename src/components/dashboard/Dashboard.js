// this a container component, connect it to the store, 
// and send needed data and functions to the contained (nested) components

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'

import CreateAlbum from "../albums/CreateAlbum";

import { createAlbum } from "../../redux-store/actions/albumActions"
import _ from "lodash";


class Dashboard extends Component {

    componentDidMount() {
        // this.props.getContacts();
    }

    render() {

        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />

        return (
            <div className="dashboard container">
                <div className="row">
                    <CreateAlbum createAlbumFun={createAlbum} />
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}
// https://hackernoon.com/why-using-nested-connect-react-redux-components-is-good-bd17997b53d2
const mapDispatchToProps = dispatch => {
    return {
        createAlbum: (album) => dispatch(createAlbum(album)),
    }
}

// map our state from the store to props in this component
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
