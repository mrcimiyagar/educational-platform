import React, { Component } from "react";

import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import {
    Button, Label, FormGroup, CustomInput, Row,
    Card,
    CardBody,
    CardTitle
} from 'reactstrap';


import IntlMessages from "Util/IntlMessages";
import { Colxx } from "Components/CustomBootstrap";

class AvailityDefaultValues extends Component {
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
        const defaultValues = {
            locationType: 'محل کار',
            locationQualities: [
                'زیبا',
                'عالی',
                'شگفت انگیز',
            ],
            firstname: 'سارا',
            lastname: 'احمدی',
            location: {
                street: 'خیابان ولیعصر',
                suite: '110',
                city: 'تهران',
                state: 'ایران',
                zip: '32256',
            }
        };

        return (

            <Card className="mb-5">
                <CardBody>
                    <h6 className="mb-4">مقدار پیش فرض</h6>

                    <AvForm onSubmit={this.handleSubmit} model={defaultValues} className="av-tooltip tooltip-right-bottom">
                        <AvRadioGroup inline name="locationType" required>
                            <Label className="d-block">نوع موقعیت</Label>
                            <AvRadio label="مسکونی" value="home" />
                            <AvRadio label="محل کار" value="work" />
                            <AvRadio label="تفریح" value="awesome" />
                        </AvRadioGroup>
                        <AvCheckboxGroup inline name="locationQualities" required>
                            <Label className="d-block">ویژگی های موقعیت</Label>
                            <AvCheckbox label="زیبا" value="beautiful" />
                            <AvCheckbox label="عالی" value="awesome" />
                            <AvCheckbox label="شگفت انگیز" value="wonderful" />
                        </AvCheckboxGroup>

                        <AvField name="firstname" label="نام" required />
                        <AvField name="lastname" label="نام خانوادگی" required />
                        <AvGroup>
                            <Label for="street">خیابان</Label>
                            <AvInput name="location.street" id="street" required />
                            <AvFeedback>خطا!</AvFeedback>
                        </AvGroup>

                        <AvField name="location.suite" label="خانه" required />
                        <AvField name="location.city" label="شهر" required />

                        <AvField type="select" name="location.state" label="موقعیت" required>
                            <option>ایران</option>
                            <option>آذربایجان</option>
                            <option>آلمان</option>
                        </AvField>

                        <AvField name="location.zip" label="کد پستی" required />

                        <FormGroup className="mb-0">
                            <Button color="primary">ارسال</Button>
                        </FormGroup>
                    </AvForm>

                </CardBody>
            </Card>
        )
    }
}

export default AvailityDefaultValues;


















