
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
        this._defaults = defaults;
        this.options= $.extend(true,this._defaults,options);
        this._name = pluginName;
        this.init();
    };

    //method for adding custom validator
    Validator.prototype.addValidator = function(value,func,msg){
        var form = this.form;
        //select every input whose "validator" attribute contains "value"
        var inputs = $("[validator *= "+value+"]");
        inputs.each(function(){
            var input = $(this);
            //If the validation function returns false, error style is added, any error msg is removed, and the validator-specific msg is added
            //If the validation function returns true, success style is added and validator-specific msg is removed ONLY if this msg exists
            var validationFunction = function(elem){
                if(!func(elem)){
//                    console.log(value +" puts error")
                    elem.parent().removeClass("has-success").addClass("has-error").children('.error-msg').remove();
                    elem.parent().append('<span class="error-msg help-block validator-'+value+'">'+msg+'</span>');
                    return false;
                }
                else{
                    if(elem.parent().children('.validator-'+value).length>0){
//                        console.log(value + " adds success")
                        elem.parent().removeClass("has-error").addClass("has-success").children('.validator-'+value).remove();
                    }
                    return true;
                }
            };

            //The validators run on events and on form submission, preventing submit
            input.on("input change click", function(){
                validationFunction(input);
            });
            form.on("submit", function(event){
                if(!validationFunction(input)){
                    event.preventDefault();

                }
            });
        });
    };

    // method for adding group validator, similar to addValidator function
    Validator.prototype.addGroupValidator = function(value,func,msg){
        var form = this.form;
        var parents = $("[group-validator *= "+value+"]");
        parents.each(function(){
            var parent = $(this);
            var inputs = parent.find("input,option");
            inputs.each(function(){
                var input = $(this);
                var multiValidationFunction = function(elementarray){
                    if(!func(elementarray)){
                        parent.removeClass("has-success").addClass("has-error").children('.error-msg').remove();
                        parent.append('<span class="error-msg help-block validator-'+value+'">'+msg+'</span>');
                        return false;
                    }
                    else{
                        if(parent.children('.validator-'+value).length>0){
                            parent.removeClass("has-error").addClass("has-success").children('.validator-'+value).remove();
                        }
                        return true;
                    }
                };
                input.on("input change click", function(){
                    multiValidationFunction(inputs);
                });
                form.on("submit", function(event){
                    if(!multiValidationFunction(inputs)){
                        event.preventDefault();
                    }
                });

            });
        });
    };

    //initialize the plugin
    Validator.prototype.init = function(){
        var plugin = this;

        //add required validator
        this.addValidator("required",
            function(elem){
                var type = elem.attr("type");
                if(type=="checkbox"){
                    return elem.is(':checked');
                }
                else {
                    return elem.val();
                }
            },
            plugin.options.errorMsgs.required
        );


        //add email validator
        this.addValidator("email",
            function(elem){
                var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRe.test(elem.val()) || !elem.val();
            },
            plugin.options.errorMsgs.email
        );
    };


    $.fn[pluginName] = function (optionsOrFunction, args) {
        if(optionsOrFunction == 'addValidator'){
            $(this).data('plugin_'+pluginName).addValidator(args[0], args[1], args[2]);
        }else if(optionsOrFunction == 'addGroupValidator'){
            $(this).data('plugin_'+pluginName).addGroupValidator(args[0], args[1], args[2]);
        }
        else {
            return this.each(function () {
                $.data(this,'plugin_'+pluginName, new Validator(this,optionsOrFunction));
            });
        }
    };

}(jQuery));