import React, { Component } from "react";
import { Formik, Form, Field } from 'formik';

import {
    Row,
    Card,
    CardBody,
    FormGroup,
    Label,
    Button,
} from "reactstrap";
import IntlMessages from "../../util/IntlMessages";
import { Colxx } from "../../components/CustomBootstrap";

class FormikBasicFormLevel extends Component {
    constructor(props) {
        super(props);
        this.validate = this.validate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(values);
    }

    validate(values) {
        let errors = {};

        if (!values.email) {
            errors.email = 'Please enter your email address';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.name) {
            errors.name = 'Please enter your name';
        } else if (values.name === 'admin') {
            error.name = 'Value must be longer than 2 characters';
        }
        return errors;
    }

    render() {
        return (
            <Row className="mb-4">
                <Colxx xxs="12">
                    <Card>
                        <CardBody>
                            <h6 className="mb-4">سطح اعتبارسنجی فرم</h6>
                            <Formik
                                validate={this.validate}
                                initialValues={{
                                    name: '',
                                    email: '',
                                }}
                                onSubmit={this.handleSubmit}>
                                {({ errors, touched, isValidating }) => (
                                    <Form className="av-tooltip tooltip-label-right">

                                        <FormGroup>
                                            <Label>
                                                نام
                                            </Label>
                                            <Field className="form-control" name="name" />
                                            {errors.name && touched.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>
                                                ایمیل
                                            </Label>
                                            <Field className="form-control" name="email" />
                                            {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                        </FormGroup>

                                        <Button color="primary" type="submit">ارسال</Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Colxx>
            </Row>
        )
    }
}

export default FormikBasicFormLevel;

