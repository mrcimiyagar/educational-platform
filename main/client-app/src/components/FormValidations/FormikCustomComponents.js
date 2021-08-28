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
import IntlMessages from "../../util/IntlMessages";
import { FormikCheckbox, FormikCheckboxGroup, FormikCustomCheckbox, FormikCustomCheckboxGroup, FormikCustomRadioGroup, FormikDatePicker, FormikRadioButtonGroup, FormikReactSelect, FormikSwitch, FormikTagsInput } from './FormikFields';



const SignupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
    select: Yup.string().required('A select option is required!'),
    reactSelect: Yup.array()
        .min(3, 'حداقل 3 برچسب انتخاب کنید')
        .of(
            Yup.object().shape({
                label: Yup.string().required(),
                value: Yup.string().required(),
            })
        ),
     checkboxSingle: Yup.bool().oneOf([true], "Must agree to something"),
     checkboxCustomSingle: Yup.bool().oneOf([true], "Must agree to something"),
     checkboxGroup: Yup.array()
     .min(2, 'حداقل 2 برچسب انتخاب کنید')
     .required(
        "حداقل یک چک باکس لازم است"
     ), 
     
     customCheckGroup: Yup.array()
     .min(2, 'حداقل 2 برچسب انتخاب کنید')
     .required(
        "حداقل یک چک باکس لازم است"
     ),
     
    radioGroup: Yup.string().required("گزینه رادیویی مورد نیاز است"),
    customRadioGroup: Yup.string().required("گزینه رادیویی مورد نیاز است"),
    tags: Yup.array()
     .min(3, 'حداقل 3 برچسب انتخاب کنید')
     .required(
         "حداقل یک چک باکس لازم است"
     ), 
     switch: Yup.bool().oneOf([true], "Must agree to something"),
     date: Yup.date().nullable().required("تاریخ مورد نیاز"),

})

const options = [
    { value: 'food', label: 'غذا' },
    { value: 'beingfabulous', label: 'فست فود' ,disabled:true },
    { value: 'reasonml', label: 'سنتی' },
    { value: 'unicorns', label: 'ایتالیایی' },
    { value: 'kittens', label: 'کباب' },
];

class FormikCustomComponents extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (values, { setSubmitting }) => {
  
        const payload = {
            ...values,
            reactSelect: values.reactSelect.map(t => t.value),
        };
        setTimeout(() => {
            console.log(JSON.stringify(payload, null, 2))
            setSubmitting(false);
        }, 1000);
    }

    render() {
        return (
            <Row className="mb-4">
                <Colxx xxs="12">
                    <Card>
                        <CardBody>
                            <h6 className="mb-4">اجزای سفارشی و پوسته با Yup</h6>
                            <Formik
                                initialValues={{ 

                                    email: 'test@test.com', 
                                    select:'3',
                                    reactSelect: [{ value: 'reasonml', label: 'فست فود' }], 
                                checkboxGroup: ['kittens'],
                                customCheckGroup: ['unicorns'],                                
                                checkboxSingle: true ,
                                checkboxCustomSingle:false,
                                radioGroup:'',
                                customRadioGroup:'',
                                tags:['کیک','دسر'],
                                switch:false,
                                date:null
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
                                        <Form className="av-tooltip tooltip-label-right">
                                            <FormGroup className="error-l-100">
                                                <Label><IntlMessages id="forms.email" /></Label>
                                                <Field className="form-control" name="email" />
                                                {errors.email && touched.email ? (
                                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-100">
                                                <Label>انتخاب </Label>
                                                <select 
                                                    name="select" 
                                                    className="form-control"
                                                    value={values.select} 
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    >
                                                    <option value="">انتخاب موارد...</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>

                                                {errors.select && touched.select ? (
                                                    <div className="invalid-feedback d-block">{errors.select}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup className="error-l-100">
                                                <Label>انتخاب ری اکت </Label>
                                                <FormikReactSelect
                                                    name="reactSelect"
                                                    id="reactSelect"
                                                    value={values.reactSelect}
                                                    isMulti={true}
                                                    options={options}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.reactSelect && touched.reactSelect ? (
                                                    <div className="invalid-feedback d-block">{errors.reactSelect}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-150">
                                                <Label className="d-block">جعبه انتخاب تک </Label>
                                                <FormikCheckbox
                                                    name="checkboxSingle"
                                                    value={values.checkboxSingle}
                                                    label="موافقم"
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.checkboxSingle && touched.checkboxSingle ? (
                                                    <div className="invalid-feedback d-block">{errors.checkboxSingle}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-150">
                                                <Label className="d-block">جعبه انتخاب تک سفارشی</Label>
                                                <FormikCustomCheckbox
                                                    name="checkboxCustomSingle"
                                                    value={values.checkboxCustomSingle}
                                                    label="موافقم"
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.checkboxCustomSingle && touched.checkboxCustomSingle ? (
                                                    <div className="invalid-feedback d-block">{errors.checkboxCustomSingle}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-150 ">
                                                <Label className="d-block">جعبه انتخاب گروهی</Label>
                                                <FormikCheckboxGroup
                                                    inline
                                                    name="checkboxGroup"
                                                    id="checkboxGroup"
                                                    label="کدام یک از اینها؟"
                                                    value={values.checkboxGroup}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    options={options}
                                                >
                                                </FormikCheckboxGroup>
                                                {errors.checkboxGroup && touched.checkboxGroup ? (
                                                    <div className="invalid-feedback d-block">{errors.checkboxGroup}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-175 ">
                                                <Label className="d-block">جعبه انتخاب گروهی سفارشی </Label>
                                                <FormikCustomCheckboxGroup
                                                    inline
                                                    name="customCheckGroup"
                                                    id="customCheckGroup"
                                                    label="کدام یک از اینها؟"
                                                    value={values.customCheckGroup}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    options={options}
                                                >
                                                </FormikCustomCheckboxGroup>
                                                {errors.customCheckGroup && touched.customCheckGroup ? (
                                                    <div className="invalid-feedback d-block">{errors.customCheckGroup}</div>
                                                ) : null}
                                            </FormGroup>


                                            <FormGroup className="error-l-150">
                                                <Label className="d-block">گزینه ی گروهی</Label>
                                                <FormikRadioButtonGroup
                                                        inline
                                                        name="radioGroup"
                                                        id="radioGroup"
                                                        label="لطفا یکی را انتخاب کنید"
                                                        value={values.radioGroup}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        options={options}
                                                    >
                                                </FormikRadioButtonGroup>
                                                {errors.radioGroup && touched.radioGroup ? (
                                                    <div className="invalid-feedback d-block">{errors.radioGroup}</div>
                                                ) : null}
                                            </FormGroup>
                                            <FormGroup className="error-l-175">
                                                <Label className="d-block">گزینه ی گروهی سفارشی</Label>
                                                <FormikCustomRadioGroup
                                                    inline
                                                    name="customRadioGroup"
                                                    id="customRadioGroup"
                                                    label="کدام یک از اینها؟"
                                                    value={values.customRadioGroup}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    options={options}
                                                >
                                                </FormikCustomRadioGroup>
                                                {errors.customRadioGroup && touched.customRadioGroup ? (
                                                    <div className="invalid-feedback d-block">{errors.customRadioGroup}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup className="error-l-175">
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

                                            <FormGroup className="error-l-100">
                                                <Label className="d-block"><IntlMessages id="form-components.switch" /></Label>
                                                <FormikSwitch
                                                    name="switch"
                                                    className="custom-switch custom-switch-primary"
                                                    value={values.switch}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                />
                                                {errors.switch && touched.switch ? (
                                                    <div className="invalid-feedback d-block">{errors.switch}</div>
                                                ) : null}
                                            </FormGroup>

                                            <FormGroup className="error-l-100">
                                                <Label className="d-block"><IntlMessages id="form-components.date-picker" /></Label>
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
};
export default FormikCustomComponents;
