import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ShippingForm from "./ShippingForm";
import Field from "../Forms/Field";

class BillingForm extends ShippingForm {
  static propTypes = {
    ...ShippingForm.propTypes,
    getShippingValue: PropTypes.func.isRequired
  };

  static formName = "billingForm";

  static fields = {
    ...ShippingForm.fields,
    cardNumber: {
      normalize: "credit_card:number",
      transform: "trim",
      validate: "required|credit_card:number",
      label: "BILLING_CARD_NUMBER_LABEL"
    },
    cardDate: {
      normalize: "credit_card:date",
      transform: "trim",
      validate: "required|credit_card:date",
      label: "BILLING_CARD_DATE_LABEL"
    },
    cardSecret: {
      normalize: "credit_card:secret",
      transform: "trim",
      validate: "required|credit_card:secret",
      label: "BILLING_CARD_SECRET_LABEL"
    },
    isSameAddress: {
      label: "BILLING_SAME_ADDRESS_LABEL"
    }
  };

  static refresh(props) {
    if (props.getValue("isSameAddress")) {
      for (let field of _.keys(BillingForm.addressFields)) {
        props.dispatch(props.change(field, props.getShippingValue(field)));
        props.dispatch(props.clearAsyncError(field));
      }
    }
  }

  static onChange(values, dispatch, props, prevValues) {
    super.onChange(values, dispatch, props, prevValues);
    if (prevValues.get("isSameAddress") !== values.get("isSameAddress"))
      this.refresh(props);
  }

  static async onValidate(
    values,
    dispatch,
    props,
    blurredField,
    transform = true
  ) {
    if (values.get("isSameAddress")) {
      for (let field of _.keys(this.addressFields))
        delete this.cachedErrors[field];
      if (!blurredField) {
        blurredField = _.difference(
          _.keys(this.fields),
          _.keys(this.addressFields)
        );
      }
    }
    return super.onValidate(values, dispatch, props, blurredField, transform);
  }

  componentDidMount() {
    if (_.isUndefined(this.props.getValue("isSameAddress")))
      this.props.change("isSameAddress", true);

    this.props.onReady({
      formName: this.constructor.formName,
      validate: this.validate.bind(this),
      refresh: () => this.constructor.refresh(this.props)
    });
  }

  render() {
    return (
      <Grid
        container
        spacing={16}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={this.submit}
      >
        <Grid container spacing={16} item xs={12}>
          <Grid item xs={12} md={6}>
            <Field name="cardNumber" type="text" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field name="cardDate" type="text" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field name="cardSecret" type="password" />
          </Grid>
        </Grid>
        <Grid container spacing={16} item xs={12}>
          <Grid item xs={12} md={6}>
            <Field name="isSameAddress" type="checkbox" />
          </Grid>
        </Grid>
        {this.renderAddressBlock(this.props.getValue("isSameAddress"))}
      </Grid>
    );
  }
}

export default BillingForm;