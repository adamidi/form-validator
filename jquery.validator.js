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
        this.form = $(element);
        this.options= $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    };

    //method for adding custom validator
    Validator.prototype.addValidator = function(value,func,msg){
        var form = this.form;
        var inputs = $("[validator *= "+value+"]");
        inputs.each(function(){
            var parent = $(this).parent();
            var validationFunction = function(elem){
                if(!func(elem)){
                    parent.removeClass("has-success").addClass("has-error").children('.error-msg').remove();
                    parent.append('<span class="error-msg">'+msg+'</span>');
                    return false
                }
                else{
                    if(parent.hasClass("has-error")){
                        parent.removeClass("has-error").addClass("has-success").children('.error-msg').remove();
                    }
                    return true
                }
            };

            $(this).on("input", function(){
                validationFunction($(this))
            });
            form.on("submit", function(event){
                if(!validationFunction($(this))){
                    event.preventDefault();
                }
            });
        });
    };

    Validator.prototype.addGroupValidator = function(value,func,msg){
        var parents = $("[group-validator *= "+value+"]");
        parents.each(function(){
            var parent = $(this);
            var inputs = parents.find("input");
            inputs.each(function(){
                $(this).on("change",function(){
                    console.log(this)
                    if(!func(inputs)){
                        parent.removeClass("has-success").addClass("has-error").children('.error-msg').remove();
                        parent.append('<span class="error-msg">'+msg+'</span>');
                    }
                    else{
                        parent.removeClass("has-error").addClass("has-success").children('.error-msg').remove();
                    }
                });
            });
        });
    };

    //initialize the plugin
    Validator.prototype.init = function(){
        var plugin = this;
        var required = $("[validator*='required']");

        //method for checking required fields or checkboxes
        var checkRequired = function(e){
            required.each(function(){
                if(!$(this).val() || !$(this).is(':checked')){
                    e.preventDefault();
                    var error = '<span class="error-msg">'+ plugin.options.errorMsgs.required +'</span>' ;
                    $(this).parent().children('.error-msg').remove();
                    $(this).parent().append(error);
                }
            });
        };

        //add validator required
        this.addValidator("required",
            function(elem){
                var type = elem.attr("type");
                if(type=="checkbox"){
                    return elem.is(':checked')
                }
                else {
                    return elem.val();
                }

            },
            plugin.options.errorMsgs.required
        );


        //add validator for emails
        this.addValidator("email",
            function(elem){
                var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRe.test(elem.val()) || !elem.val();
            },
            plugin.options.errorMsgs.email
        );

        //validate on submit
//        this.form.submit(function(event){
////            checkRequired(event);
//            var errors = this.form.find(".has-error");
//            if(errors.length>0) {
//                event.preventDefault();
//            }
//        });
    };


    $.fn[pluginName] = function (optionsOrFunction, arguments) {
        if(optionsOrFunction == 'addValidator'){
            $(this).data('plugin_'+pluginName).addValidator(arguments[0], arguments[1], arguments[2]);
        }else if(optionsOrFunction == 'addGroupValidator'){
            $(this).data('plugin_'+pluginName).addGroupValidator(arguments[0], arguments[1], arguments[2]);
        }
        else {
            return this.each(function () {
                $.data(this,'plugin_'+pluginName, new Validator(this,optionsOrFunction))
            });
        }
    };


}(jQuery));