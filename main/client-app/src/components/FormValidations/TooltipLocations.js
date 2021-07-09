import React, { Component } from "react";

import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import {
    Button,
    Label,
    Card,
    CardBody,
    Row
} from 'reactstrap';


import IntlMessages from "../../Util/IntlMessages";
import { Colxx } from "../../Components/CustomBootstrap";

class AvailityBasic extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Card className="mb-5">
                <CardBody>

                    <h6 className="mb-4">موقعیت</h6>
                    <AvForm className="av-tooltip mb-5" onSubmit={this.handleSubmit}>
                        <AvGroup className="error-l-100 tooltip-label-right">
                            <Label>برچسب راست</Label>
                            <AvInput name="input1" required />
                            <AvFeedback>برچسب راست!</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-center-top">
                            <Label>بالا وسط</Label>
                            <AvInput name="input2" required />
                            <AvFeedback>بالا وسط!</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-center-bottom">
                            <Label>پایین وسط</Label>
                            <AvInput name="input3" required />
                            <AvFeedback>پایین وسط!</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-left-top">
                            <Label>بالا چپ</Label>
                            <AvInput name="input4" required />
                            <AvFeedback>بالا چپ</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-right-top">
                            <Label>بالا راست</Label>
                            <AvInput name="input5" required />
                            <AvFeedback>بالا راست!</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-left-bottom">
                            <Label>پایین چپ</Label>
                            <AvInput name="input6" required />
                            <AvFeedback>پایین چپ!</AvFeedback>
                        </AvGroup>

                        <AvGroup className="tooltip-right-bottom">
                            <Label>پایین راست</Label>
                            <AvInput name="input7" required />
                            <AvFeedback>پایین راست!</AvFeedback>
                        </AvGroup>

                        <Button color="primary">ارسال</Button>
                    </AvForm>



                    <h6 className="mb-4">برچسب سمت چپ</h6>
                    <AvForm className="av-tooltip mb-5 tooltip-label-right" onSubmit={this.handleSubmit}>

                        <Row>
                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-0">
                                    <Label>خطا-l-0</Label>
                                    <AvInput name="input1" required />
                                    <AvFeedback>خطا-l-0</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-25">
                                    <Label>خطا-l-25</Label>
                                    <AvInput name="input2" required />
                                    <AvFeedback>خطا-l-25</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-50">
                                    <Label>خطا-l-50</Label>
                                    <AvInput name="input3" required />
                                    <AvFeedback>خطا-l-50</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-75">
                                    <Label>خطا-l-75</Label>
                                    <AvInput name="input4" required />
                                    <AvFeedback>خطا-l-75</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-100">
                                    <Label>خطا-l-100</Label>
                                    <AvInput name="input5" required />
                                    <AvFeedback>خطا-l-100</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-125">
                                    <Label>خطا-l-125</Label>
                                    <AvInput name="input6" required />
                                    <AvFeedback>خطا-l-125</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-150">
                                    <Label>خطا-l-150</Label>
                                    <AvInput name="input7" required />
                                    <AvFeedback>خطا-l-150</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-175">
                                    <Label>خطا-l-175</Label>
                                    <AvInput name="input8" required />
                                    <AvFeedback>خطا-l-175</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-200">
                                    <Label>خطا-l-200</Label>
                                    <AvInput name="input9" required />
                                    <AvFeedback>خطا-l-200</AvFeedback>
                                </AvGroup>
                            </Colxx>
                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-225">
                                    <Label>خطا-l-225</Label>
                                    <AvInput name="input10" required />
                                    <AvFeedback>خطا-l-225</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-250">
                                    <Label>خطا-l-250</Label>
                                    <AvInput name="input11" required />
                                    <AvFeedback>خطا-l-250</AvFeedback>
                                </AvGroup>
                            </Colxx>

                            <Colxx xxs="12" sm="6">
                                <AvGroup className="error-l-275">
                                    <Label>خطا-l-275</Label>
                                    <AvInput name="input12" required />
                                    <AvFeedback>خطا-l-275</AvFeedback>
                                </AvGroup>
                            </Colxx>
                        </Row>
                        <Button color="primary">ارسال</Button>
                    </AvForm>

                </CardBody>
            </Card>
        )
    }
}

export default AvailityBasic;
