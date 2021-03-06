import React, {Component} from "react";
import {Meteor} from "meteor/meteor";
import {Tracker} from "meteor/tracker";
import {Links} from "../api/links";
import LinkListItem from "../ui/LinkListItem";
import {Session} from "meteor/session";
import FlipMove from "react-flip-move";

export default class LinksList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            links: []
        }
    }

    componentDidMount() {
        this.linksTracker = Tracker.autorun(() => {
            Meteor.subscribe('links');
            const links = Links.find({
                visible: Session.get('showVisible')
            }).fetch();
            this.setState({links});
        });
    }

    componentWillUnmount() {
        this.linksTracker.stop();
    }

    renderLinksListItems() {
        if (this.state.links.length === 0) {
            return (
                <div className="item item__status-message">
                    <p>Ooops! No links found here.</p>
                </div>
            )
        }

        // mapping links list
        return this.state.links.map((link) => {
            const shortUrl = Meteor.absoluteUrl(link._id);
            return <LinkListItem key={link._id} shortUrl={shortUrl} {...link}/>;
        })
    }

    render() {
        return (
            <div>
                <h2>Links List</h2>
                <hr/>
                <FlipMove maintainContainerHeight={true} typeName="ul">
                    {this.renderLinksListItems()}
                </FlipMove>
            </div>
        )
    }

}