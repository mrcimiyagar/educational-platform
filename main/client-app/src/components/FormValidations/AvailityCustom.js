import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import React, { Component } from "react";
import {
    Button, Card,
    CardBody, Label
} from 'reactstrap';




class AvailityCustom extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, errors, values) {
        console.log(errors);
        console.log(values);
        if(errors.length === 0) {
            //submit
        }
    }
    
    render() {
        return (

            <Card className="mb-5">
                <CardBody>
                    <h6 className="mb-4">قوانین دسترسی</h6>

                    <AvForm className="av-tooltip tooltip-label-right" onSubmit={this.handleSubmit}>

                        <AvGroup className="error-t-negative">
                            <Label>نام</Label>
                            <AvField name="nameCustomMessage" type="text" validate={{
                                required: { value: true, errorMessage: 'لطفا نام خود را وارد کنید' },
                                pattern: { value: '^[A-Za-z]+$', errorMessage: 'نام شما باید فقط با حروف باشد' },
                                minLength: { value: 2, errorMessage: 'نام شما باید بین 2 تا 16 حرف باشد' },
                                maxLength: { value: 16, errorMessage: 'نام شما باید بین 2 تا 16 حرف باشد' }
                            }} />
                        </AvGroup>

                        <AvGroup className="error-t-negative">
                            <Label>ایمیل</Label>
                            <AvField name="emailCustomMessage" type="email" validate={{
                                required: { value: true, errorMessage: 'لطفا آدرس ایمیل خود را وارد کنید' },
                                email: { value: true, errorMessage: 'لطفا یک آدرس ایمیل معتبر وارد کنید' },
                            }} />
                        </AvGroup>

                        <AvGroup className="error-l-100 error-t-negative">
                            <Label>تکرار ایمیل</Label>
                            <AvField name="confirmationEmail" type="email" validate={{
                                match: { value: 'emailCustomMessage', errorMessage: 'ورودی های شما مطابقت ندارد' },
                                required: { value: true, errorMessage: 'لطفا آدرس ایمیل خود را وارد کنید' }
                            }} />
                        </AvGroup>

                        <AvGroup className="error-l-100 error-t-negative">
                            <Label>شماره تماس</Label>
                            <AvField name="numberProp" type="text" validate={{
                                number: {value: true, errorMessage: 'مقدار باید عدد باشد'},
                                required: {value: true, errorMessage: 'لطفا عدد وارد کنید'} } } />
                        </AvGroup>

                        <AvGroup className="error-t-negative">
                            <Label>بیشتر</Label>
                            <AvField name="maxPropNumberProp" type="text" validate={{
                                max: { value: 5, errorMessage: 'حداقل 5 کاراکتر' },
                                required: { value: true, errorMessage: 'لطفا عدد وارد کنید' }
                            }} />
                        </AvGroup>

                        <AvGroup className="error-t-negative">
                            <Label>کمتر</Label>
                            <AvField name="minPropNumberProp" type="text" validate={{
                                min: { value: 5, errorMessage: 'حداکثر 5' },
                                required: { value: true, errorMessage: 'لطفا عدد وارد کنید' } }} />
                        </AvGroup>

                        <AvGroup className="error-l-125 error-t-negative">
                            <Label>Regex (^[A-Z]*$)</Label>
                            <AvField name="patternPropRegex" type="text" validate={{
                                pattern: {value: /^[A-Z]*$/ , errorMessage: 'فقط کاراکترهای بزرگ'},
                                required: { value: true, errorMessage: 'لطفا کاراکترهای بزرگ را وارد کنید' } }}  />
                        </AvGroup>

                        <Button color="primary">ارسال</Button>
                    </AvForm>

                </CardBody>
            </Card>

        )
    }
}

export default AvailityCustom;





























