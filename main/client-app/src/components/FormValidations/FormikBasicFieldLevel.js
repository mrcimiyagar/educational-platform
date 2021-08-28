import { Field, Form, Formik } from 'formik';
import React, { Component } from "react";
import {
    Button, Card,
    CardBody,
    FormGroup,
    Label, Row
} from "reactstrap";
import { Colxx } from "../../components/CustomBootstrap";


class FormikBasicFieldLevel extends Component {
    constructor(props) {
        super(props);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateName = this.validateName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(values);
    }

    validateEmail(value) {
        let error;
        if (!value) {
            error = 'Please enter your email address';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Invalid email address';
        }
        return error;
    }

    validateName(value) {
        let error;
        if (!value) {
            error = 'لطفا نام خود را وارد کنید';
        } else if (value.length < 2) {
            error = 'مقدار باید بیش از 2 کاراکتر باشد';
        }
        return error;
    }

    render() {
        return (
            <Row className="mb-4">
                <Colxx xxs="12">
                    <Card>
                        <CardBody>
                            <h6 className="mb-4">سطح اعتبار سنجی</h6>
                            <Formik
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
                                            <Field className="form-control"  name="name" validate={this.validateName} />
                                            {errors.name && touched.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>
                                                ایمیل
                                            </Label>
                                            <Field className="form-control" name="email" validate={this.validateEmail} />
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

export default FormikBasicFieldLevel;

