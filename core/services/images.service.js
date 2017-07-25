import React, { Component } from 'react';

export default class Images extends Component {
    static FlagButton = require("../../images/redflag.gif");
    static FlagXButton = require("../../images/redflag-x.gif");
    static AppNameLogoLarge = require("../../images/appname-logo-large2.jpg");
    static AppLogo = require("../../images/app-logo.png");

    static getImage(id) {
        // We check if the image is present within the app bundle
        const entry = _.get(Images, _.camelCase(id));
        if (entry !== undefined) {
            return entry;
        } else {
            // If not, we return a remote link for that image
            return { uri: `${StaticDomain}/${id}` };
        }
    }
} 