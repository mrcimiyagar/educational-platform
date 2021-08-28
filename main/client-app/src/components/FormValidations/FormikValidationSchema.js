import { Field, Form, Formik } from 'formik';
import React, { Component } from "react";
import {
    Button, Card,
    CardBody,
    FormGroup,
    Label, Row
} from "reactstrap";
import * as Yup from 'yup';
import { Colxx } from "../../components/CustomBootstrap";





const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please enter your first name'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please enter your last name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter your email address'),
    details: Yup.string()
        .required('Please provide the details')
});


class FormikValidationSchema extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(values);
    }

    render() {
        return (
            <Row className="mb-4">
                <Colxx xxs="12">
                    <Card>
                        <CardBody>
                            <h6 className="mb-4">طرح اعتبار سنجی با Yup</h6>

                            <Formik
                                initialValues={{
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    details: "",
                                }}
                                validationSchema={SignupSchema}
                                onSubmit={this.handleSubmit} >
                                {({ handleSubmit,
                                    setFieldValue,
                                    setFieldTouched,
                                    values,
                                    errors,
                                    touched,
                                    isSubmitting }) => (
                                        <Form className="av-tooltip tooltip-label-right">
                                            <FormGroup className="error-l-75">
                                                <Label>نام </Label>
                                                <Field className="form-control" name="firstName" />
                                                {errors.firstName && touched.firstName ? (
                                                    <div className="invalid-feedback d-block">{errors.firstName}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup className="error-l-75">
                                                <Label>نام خانوادگی</Label>
                                                <Field className="form-control" name="lastName" />
                                                {errors.lastName && touched.lastName ? (
                                                    <div className="invalid-feedback d-block">{errors.lastName}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>ایمیل</Label>
                                                <Field className="form-control" name="email" type="email" />
                                                {errors.email && touched.email ? (
                                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>جزئیات</Label>
                                                <Field className="form-control" name="details" component="textarea" />
                                                {errors.details && touched.details ? (
                                                    <div className="invalid-feedback d-block">{errors.details}</div>
                                                ) : null}
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

export default FormikValidationSchema;

