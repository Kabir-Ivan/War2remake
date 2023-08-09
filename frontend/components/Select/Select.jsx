import React, {Component} from "react";
import "./Select.css"

class Select extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        const { className, id, ...newProps } = this.props;
        return (
            <div class="war-select-box" {...newProps}>
            <select {...this.props}>
                {this.props.children}
            </select>
            </div>
        )
    }
}

export default Select;