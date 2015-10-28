define(['jquery'],function($) {
    // var $ = require('jquery');
    var Module = {};
    var constructors = {};
    var tmpl = {};
    window.DS = window.DSModule = Module;

    Module.add = function(name, constructor) {
        constructors[name] = constructor;
    };

    Module.get = function(name) {
        return constructors[name];
    };

    Module.list = function() {
        return constructors;
    };

    Module.app = function(config) {
        if (config == undefined) {
            return;
        }
        for (var name in config) {
            _initModule(name, config[name]);
        }
    };

    Module.addTmpl = function(name, constructor) {
        tmpl[name] = constructor();
    };

    Module.getTmpl = function(name) {
        return tmpl[name];
    };

    Module.listTmpl = function() {
        return tmpl;
    };

    //将消息传递到另一个module，本质是调用另一个模块的方法
    Module.sent = function(moduleName, methodName, args) {
        if (constructors[moduleName] && constructors[moduleName][methodName]) {
            constructors[moduleName][methodName](args);
        }
    };

    //兼容一些事件，比如input和propertychange

    function _getCommonType(type) {
        if (type == "input" && (!$.support.input)) {
            return "propertychange";
        }
        return type;
    }

    function _initModule(name, config) {
        require([name], function(constructor) {
            /*console.log(constructor);*/
            /* constructor here is the set of module's useable method*/
            var module = constructors[name] = constructor;
            module.init && module.init(config);
            module.fn && $.extend(module, module.fn);
            if (module.action) {
                var action = module.action;
                for (var type in action) {
                    for (var selector in action[type]) {
                        var comType = _getCommonType(type);
                        $(selector).bind(comType, action[type][selector]);
                    }
                }
            }
            if (module.delegate) {
                var action = module.delegate;
                for (var type in action) {
                    for (var selector in action[type]) {
                        var comType = _getCommonType(type);
                        $("body").delegate(selector, comType, action[type][selector]);
                    }
                }
            }
            if(module.prepare) {
                var action = module.prepare;
                for(var type in action) {
                    module.prepare[type]();
                }
            }
        });
    }
    // return Module;
});