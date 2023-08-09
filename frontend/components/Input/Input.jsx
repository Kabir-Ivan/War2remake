import React, {Component} from "react";
import "./Input.css"

class Input extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <input className={"warinput " + "i-sz-" + (this.props.s ? this.props.s : "m")} {...this.props}/>
        )
    }
}

export default Input;