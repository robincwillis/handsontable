(function (Handsontable) {
  var DateEditor = Handsontable.editors.TextEditor.prototype.extend();

  var $;

  DateEditor.prototype.init = function () {

    if(typeof jQuery != 'undefined') {
      $ = jQuery;
    } else {
      throw new Error("You need to include jQuery to your project in order to use the jQuery UI Datepicker.");
    }

    if (!$.fn.datepicker){
      throw new Error("Bootstrap Date Picker dependency not found. Did you forget to include it?");
    }

    Handsontable.editors.TextEditor.prototype.init.apply(this, arguments);

    this.isCellEdited = false;
    var that = this;

    this.instance.addHook('afterDestroy', function () {
      that.destroyElements();
    });

  };

  DateEditor.prototype.createElements = function () {
    Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);
    this.datePicker = document.createElement('DIV');
    Handsontable.Dom.addClass(this.datePicker, 'htDatepickerHolder');
    this.datePickerStyle = this.datePicker.style;
    this.datePickerStyle.position = 'absolute';
    this.datePickerStyle.top = 0;
    this.datePickerStyle.left = 0;
    this.datePickerStyle.zIndex = 101;
    document.body.appendChild(this.datePicker);


    var input = document.createElement("input");
    input.type = "text";
    input.style.width = "100%";
    input.style.height = "100%";
    input.style.border = "none";
    input.value = this.originalValue || "";
    this.datePicker.appendChild(input);
    this.$datePicker = $(this.datePicker).find('input');

    var that = this;
    this.$datePicker.datepicker({
      autoclose : true,
      format: 'mm/dd/yyyy'
    })

    .on('changeDate', function(e){
      that.setValue(e.format());
    }).on('show', function(e){
    /**
     * Prevent recognizing clicking on Bootstrap Datepicker as clicking outside of table
     */
      var dropdown = $('.datepicker')[0];
      eventManager.addEventListener(dropdown, 'mousedown', function (event) {
       Handsontable.helper.stopPropagation(event);
      });
    });

    var eventManager = Handsontable.eventManager(this);
    eventManager.addEventListener(this.datePicker, 'mousedown', function (event) {
      Handsontable.helper.stopPropagation(event);
    });

    this.hideDatepicker();
  };

  DateEditor.prototype.destroyElements = function () {
    this.$datePicker.datepicker('destroy');
    this.$datePicker.remove();
  };

  DateEditor.prototype.open = function () {
    Handsontable.editors.TextEditor.prototype.open.call(this);
    this.showDatepicker();
  };

  DateEditor.prototype.finishEditing = function (isCancelled, ctrlDown) {
    this.hideDatepicker();
    Handsontable.editors.TextEditor.prototype.finishEditing.apply(this, arguments);
  };

  DateEditor.prototype.showDatepicker = function () {
    var offset = Handsontable.Dom.offset(this.TD);
    this.datePickerStyle.top = (offset.top + 1) + 'px';
    this.datePickerStyle.left = (offset.left +1) + 'px';
    this.datePickerStyle.width = (Handsontable.Dom.outerWidth(this.TD) -3) + 'px';
    this.datePickerStyle.height = (Handsontable.Dom.outerHeight(this.TD) -3) + 'px';

    var DatepickerSettings = function () {};
    DatepickerSettings.prototype = this.cellProperties;
    var datepickerSettings = new DatepickerSettings();
    datepickerSettings.defaultDate = this.originalValue || void 0;
    if (this.originalValue) {
      this.$datePicker.datepicker('update',this.originalValue);
    }
    this.datePickerStyle.display = 'block';
    this.$datePicker.datepicker('show');
  };

  DateEditor.prototype.hideDatepicker = function () {
    this.datePickerStyle.display = 'none';
  };


  Handsontable.editors.DateEditor = DateEditor;
  Handsontable.editors.registerEditor('date', DateEditor);
})(Handsontable);
