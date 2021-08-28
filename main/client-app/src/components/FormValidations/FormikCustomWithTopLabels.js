import { Field, Form, Formik } from 'formik';
import React, { Component } from "react";
import {
    Button, Card,
    CardBody, CardTitle, FormGroup,
    Label, Row
} from "reactstrap";
import * as Yup from 'yup';
import { Colxx } from "../../components/CustomBootstrap";
import IntlMessages from "../../util/IntlMessages";
import { FormikDatePicker, FormikReactSelect, FormikTagsInput } from './FormikFields';



const SignupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
    password: Yup.string()
        .required('Password is required!'),
    tags: Yup.array()
        .min(3, 'حداقل 3 برچسب انتخاب کنید')
        .required("حداقل یک تگ مورد نیاز است"),
    date: Yup.date()
        .nullable()
        .required("تاریخ مورد نیاز"),
    state: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
        })
        .nullable()
        .required('State is required!'),
})

const options = [
    { value: 'food', label: 'غذا' },
    { value: 'beingfabulous', label: 'فست فود' ,disabled:true },
    { value: 'reasonml', label: 'سنتی' },
    { value: 'unicorns', label: 'ایتالیایی' },
    { value: 'kittens', label: 'کباب' },
];

class FormikCustomWithTopLabels extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (values, { setSubmitting }) => {
  
        const payload = {
            ...values,
            state: values.state.value,
        };
        setTimeout(() => {
            console.log(JSON.stringify(payload, null, 2))
            setSubmitting(false);
        }, 1000);
    }

    render() {
        return (
            <div>
                <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="forms.top-labels-over-line" />
                </CardTitle>


                <Formik initialValues={{ 
                        email: 'test@test.com', 
                        password: '', 
                        tags:[],
                        date:null,
                        state: { value: 'reasonml', label: 'فست فود' }
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={this.handleSubmit}>
                                {({ handleSubmit,
                                    setFieldValue,
                                    setFieldTouched,
                                    handleChange,
                                    handleBlur,
                                    values,
                                    errors,
                                    touched,
                                    isSubmitting }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                            <FormGroup className="form-group has-float-label">
                                <Label><IntlMessages id="forms.email" /></Label>
                                <Field className="form-control" name="email" />
                                {errors.email && touched.email ? (
                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                ) : null}
                            </FormGroup>
                            <FormGroup className="form-group has-float-label">
                                <Label><IntlMessages id="forms.password" /></Label>
                                <Field className="form-control" name="password" type="password" />
                                {errors.password && touched.password ? (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-float-label">
                                <Label className="d-block"><IntlMessages id="form-components.tags" /></Label>
                                <FormikTagsInput
                                    name="tags"
                                    value={values.tags}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                
                                {errors.tags && touched.tags ? (
                                    <div className="invalid-feedback d-block">{errors.tags}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-float-label">
                                <Label className="d-block"><IntlMessages id="form-components.date" /></Label>
                                <FormikDatePicker
                                    name="date"
                                    value={values.date}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                {errors.date && touched.date ? (
                                    <div className="invalid-feedback d-block">{errors.date}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-float-label">
                                <Label><IntlMessages id="forms.state" /></Label>
                                <FormikReactSelect
                                    name="state"
                                    id="state"
                                    value={values.state}
                                    options={options}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                {errors.state && touched.state ? (
                                    <div className="invalid-feedback d-block">{errors.state}</div>
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


<Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="forms.top-labels-in-input" />
                </CardTitle>


                <Formik initialValues={{ 
                        email: 'test@test.com', 
                        password: '', 
                        tags:[],
                        date:null,
                        state: { value: 'reasonml', label: 'فست فود' }
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={this.handleSubmit}>
                                {({ handleSubmit,
                                    setFieldValue,
                                    setFieldTouched,
                                    handleChange,
                                    handleBlur,
                                    values,
                                    errors,
                                    touched,
                                    isSubmitting }) => (
                        <Form className="av-tooltip tooltip-label-bottom">
                            <FormGroup className="form-group has-top-label">
                                <Label><IntlMessages id="forms.email-u" /></Label>
                                <Field className="form-control" name="email" />
                                {errors.email && touched.email ? (
                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                ) : null}
                            </FormGroup>
                            <FormGroup className="form-group has-top-label">
                                <Label><IntlMessages id="forms.password-u" /></Label>
                                <Field className="form-control" name="password" type="password" />
                                {errors.password && touched.password ? (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-top-label">
                                <Label className="d-block"><IntlMessages id="forms.tags-u" /></Label>
                                <FormikTagsInput
                                    name="tags"
                                    value={values.tags}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                
                                {errors.tags && touched.tags ? (
                                    <div className="invalid-feedback d-block">{errors.tags}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-top-label">
                                <Label className="d-block"><IntlMessages id="forms.date-u" /></Label>
                                <FormikDatePicker
                                    name="date"
                                    value={values.date}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                {errors.date && touched.date ? (
                                    <div className="invalid-feedback d-block">{errors.date}</div>
                                ) : null}
                            </FormGroup>

                            <FormGroup className="form-group has-top-label">
                                <Label><IntlMessages id="forms.state-u" /></Label>
                                <FormikReactSelect
                                    name="state"
                                    id="state"
                                    value={values.state}
                                    options={options}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                />
                                {errors.state && touched.state ? (
                                    <div className="invalid-feedback d-block">{errors.state}</div>
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
            </div>
        )
    }
};
export default FormikCustomWithTopLabels;
