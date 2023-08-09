import React, {Component} from "react";
import "./Button.css"

class Button extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <button className={"warbutton"} {...this.props}>{this.props.children}</button>
        )
    }
}

export default Button;