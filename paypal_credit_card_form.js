Template.paypalCreditCardForm.card_data = function(){
  return {
      type: $('#card-type').val(),
      name: $('#name').val(),
      number: $('#card-number').val(),
      expire_month: $('#expire-month').val(),
      expire_year: $('#expire-year').val(),
      cvv: $('#cvv').val()
  };
};

Meteor.startup(function() {
  Session.set("PaypalCreditCardFormErrors", []);
});

var cardTypes = {
  "3" : "americanexpress",
  "4" : "visa",
  "5" : "mastercard",
  "6" : "discover"
}

Template.paypalCreditCardForm.events({
  "submit" : function(e) {
    if (Template.paypalCreditCardForm.validate() === false) {
      return false;
    }
  },
  "blur #card-number" : function(event, template) {
    var input = $(event.target),
        number = input.val(),
        type;

    number = number.replace(/[^0-9]/g,'');
    input.val(number);
    type = cardTypes[number.substring(0,1)];
    if (type !== undefined) {
      console.log(type);
      $("#card-type").val(type);
    }
  }
});

Template.paypalCreditCardForm.errors = function() {
  return Session.get("PaypalCreditCardFormErrors");
};

Template.paypalCreditCardForm.validate = function(){
  var data = Template.paypalCreditCardForm.card_data(),
      errors = [],
      valid = true;

  if (data.number.length && Meteor.Paypal.luhnChk(data.number) === false) {
    valid = false;
    errors.push({
      field: "#card-number",
      message: "Credit card number is not correct."
    });
  }

  if (data.number.trim().length === 0) {
    valid = false;
    errors.push({
      field: "#name",
      message: "You must enter a credit card number."
    });
  }

  if (data.name.trim().length === 0) {
    valid = false;
    errors.push({
      field: "#name",
      message: "You must provide a name."
    });
  }

  if (data.type.length === 0) {
    valid = false;
    errors.push({
      field: "#card-type",
      message: "You must choose a card type."
    });
  }

  if (data.expire_year.length === 0) {
    valid = false;
    errors.push({
      field: "#name",
      message: "You must provide an expiration month value."
    });
  }

  if (data.expire_year.length === 0) {
    valid = false;
    errors.push({
      field: "#expire_month",
      message: "You must provide an expiration year value."
    });
  }

  Session.set("PaypalCreditCardFormErrors", errors);
  console.log(errors, data);

  return valid;
};
