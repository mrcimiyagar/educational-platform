import { AvCheckbox, AvCheckboxGroup, AvFeedback, AvField, AvForm, AvGroup, AvInput, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation';
import React, { Component } from "react";
import {
    Button, Card,
    CardBody, Label
} from 'reactstrap';




class AvailityBasic extends Component {
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
                    <h6 className="mb-4">پایه</h6>

                    <AvForm className="av-tooltip tooltip-label-right" onSubmit={this.handleSubmit}>
                        <AvGroup>
                            <Label>نام</Label>
                            <AvInput name="name" required />
                            <AvFeedback>نام مورد نیاز است</AvFeedback>
                        </AvGroup>

                        <AvGroup>
                            <Label>رتبه</Label>
                            <AvInput name="rank" required />
                            <AvFeedback>این یک خطااست</AvFeedback>
                        </AvGroup>

                        <AvField type="select" name="select" required label="مورد انتخابی" errorMessage='لطفا یک مورد را انتخاب کنید'>
                            <option value="0"></option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </AvField>

                        <AvGroup>
                            <Label>جزئیات</Label>
                            <AvInput type="textarea" name="details" id="details" required />
                            <AvFeedback>لطفا برخی جزئیات را وارد کنید</AvFeedback>
                        </AvGroup>

                        <AvRadioGroup className="error-l-150" name="radioCustomInputExample" required>
                            <Label className="d-block">دکمه ی انتخابی سفارشی</Label>
                            <AvRadio customInput label="کیک" value="Cake" />
                            <AvRadio customInput label="کاپ کیک" value="Cupcake" />
                            <AvRadio customInput label="دسر" value="Dessert" />
                        </AvRadioGroup>

                        <AvCheckboxGroup className="error-l-150" inline name="checkboxCustomInputExample2" required>
                            <Label className="d-block">جعبه ی سفارشی</Label>
                            <AvCheckbox customInput label="بله" value="Yes" />
                            <AvCheckbox customInput label="خیر" value="No" />
                        </AvCheckboxGroup>
                        <Button color="primary">ارسال</Button>

                    </AvForm>
                </CardBody>
            </Card>

        )
    }
}

export default AvailityBasic;
