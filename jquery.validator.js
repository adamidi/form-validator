/**
 * Created by efi on 27/2/2015.
 */

;(function ($) {

    //define defaults
    var pluginName = 'validator',
        defaults = {
            errorMsgs: {
                email: "This is not an email",
                required: "This field is required"
            }
        };

    //plugin constructor
    var Validator = function(element,options){
        this.element = element;
        this.options= $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    };

    //method for adding custom validator
    Validator.prototype.addCustomValidator = function(value,func,msg){
        var txt = $("[validator *= "+value+"]");
        txt.each(function(){
            var parent = $(this).parent();
            $(this).on("input",function(){
                if(!func($(this))){
                    parent.removeClass("has-success").addClass("has-error").children('.error-msg').remove();
                    parent.append('<span class="error-msg">'+msg+'</span>');
                }
                else{
                    parent.removeClass("has-error").addClass("has-success").children('.error-msg').remove();
                }
            });
        });
    };

    //initialize the plugin
    Validator.prototype.init = function(){
        var plugin = this;
        var form  = $(this.element);
        var required = $("[validator*='required']");

        //method for checking required fields or checkboxes
        var checkRequired =  function(e){
            required.each(function(){
                if(!$(this).val()){
                    e.preventDefault();
                    var error = '<span class="error-msg">'+ plugin.options.errorMsgs.required +'</span>' ;
                    $(this).parent().children('.error-msg').remove();
                    $(this).parent().append(error);
                }
            });
        };

        //add validator for emails
        this.addCustomValidator("email",
            function(elem){
                var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRe.test(elem.val());
            },
            plugin.options.errorMsgs.email
        );

        //validate on submit
        form.submit(function(event){
            checkRequired(event);
            var errors = form.find(".has-error");
            if(errors.length>0) {
                event.preventDefault();
            }
        });
    };


    $.fn[pluginName] = function (optionsOrFunction, arguments) {
        if(optionsOrFunction == 'addCustomValidator'){
            $(this).data('plugin_'+pluginName).addCustomValidator(arguments[0], arguments[1], arguments[2]);
        } else {
            return this.each(function () {
                $.data(this,'plugin_'+pluginName, new Validator(this,optionsOrFunction))
            });
        }
    };


}(jQuery));