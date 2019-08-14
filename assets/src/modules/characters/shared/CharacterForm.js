import React from 'react';
import { Field, reduxForm } from 'redux-form';

class CharacterForm extends React.Component{
    renderError({ error, touched}){
        if (touched && error){
            return (
                <div className="ui error message">
                <div className="header">{error}</div>
                </div>
            )
        }
    }

    renderInput = ({ input, label, meta}) => {
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`
        return (
            <div className={className}>
                <label {...input} autoComplete="off"/>
                {this.renderError(meta)}
            </div>
        );
    };

    onSubmit = formValues => {
        this.props.onSubmit(formValues);
    }

    render () {
        return (
            <form
                onSubmit={this.props.handleSubmit(this.Submit)}
                className="ui form error">
                <Field name="name" component={this.renderInput} label="Enter a name"/>
                <Field name="class" component={this.renderInput}
                    label="Select a class"/>

                <button className="ui button primary">Submit</button>
                </form>
        )
    }
}

const validate = formValues => {
    const errors = {};

    if (!formValues.name) {
        errors.name = "You must enter a name"
    }
    if (!formValues.class) {
        errors.class = "You must select a class"
    }

    return errors;
}

export default reduxForm({
    form: 'characterForm',
    validate
})(CharacterForm);