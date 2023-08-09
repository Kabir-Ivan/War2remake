import React, { Component } from "react";
import "./Checkbox.css";

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: Boolean(this.props.value) || false
        };
    }

    handleCheckboxChange = () => {
        this.setState(prevState => ({
            value: !prevState.value
        }));
    };

    render() {
        const { className, id, ...newProps } = this.props;
        return (
            <div className="war-checkbox" {...newProps}>
                <div className="checkbox-wrapper-13">
                    <input
                        className="c1-13"
                        type="checkbox"
                        onClick={this.handleCheckboxChange}
                        {...this.props}
                    />
                </div>
            </div>
        );
    }
}

export default Checkbox;
