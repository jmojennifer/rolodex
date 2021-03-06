import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';

import ContactView from 'app/views/contact_view';

var RolodexView = Backbone.View.extend({

  initialize: function(options){

    this.contactNameTemplate = _.template($('#tmpl-contact-card').html());

    this.contactDetailsTemplate = _.template($('#tmpl-contact-details').html());

    this.contactNameElement = this.$('#contact-cards');

    this.contactDetailsElement = this.$('#contact-details');

    console.log("Contact is: ", this.contactNameElement);

    this.contactList = [];

    this.model.forEach(function(rawContact) {
      this.addContact(rawContact);
    }, this);

    this.input = {
      name: this.$('.contact-form input[name="name"]'),
      email: this.$('.contact-form input[name="email"]'),
      phone: this.$('.contact-form input[name="phone"]')
    };

    this.listenTo(this.model, 'add', this.addContact);

    this.listenTo(this.model, 'update', this.render);
  },

  render: function() {
    this.contactNameElement.empty();
    this.contactDetailsElement.empty();

    this.contactList.forEach(function(contact) {
      contact.render();
      this.contactNameElement.append(contact.$el);
    }, this);
    return this;
  },

  events: {
    'click .btn-cancel': 'cancelInput',
    'click .btn-save': 'saveContact',
    'click': 'hideDetails',
  },

  addContact: function(contact_info) {

    var contact = new ContactView({
      model: contact_info,
      template: this.contactNameTemplate
    });

    this.listenTo(contact, 'showDetails', this.showDetails);

    this.listenTo(contact, 'hideDetails', this.hideDetails);

    this.contactList.push(contact);

    return this;
  },

  cancelInput: function(event) {
    this.input.name.val('');
    this.input.email.val('');
    this.input.phone.val('');
  },

  getInput: function() {
    var contact = {
      name: this.input.name.val(),
      email: this.input.email.val(),
      phone: this.input.phone.val(),
    };
    return contact;
  },

  saveContact: function(event) {
    event.preventDefault();

    var rawContact = this.getInput();

    this.model.add(rawContact);

    this.cancelInput();
  },

  showDetails: function(contactDetail) {
    this.contactDetailsElement.show();
    var html = this.contactDetailsTemplate(contactDetail.model.attributes);
    this.contactDetailsElement.html(html);
  },

  hideDetails: function(event) {
    this.contactDetailsElement.hide();
  }

});

export default RolodexView;
