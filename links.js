M.wrap('github/jillix/crud-links/dev/links.js', function (require, module, exports) {

var Events = require('github/jillix/events');

var devConfig = {
    
    // connect external modules
    "listen": {
        "data_list_templates": {
            "selectionChanged": [
                { "emit": "setTemplate" }
            ]
        },
        "data_form": {
            "dataSet": [
                { "emit": "setData" }
            ]
        }
    }
};

function setData (data) {
    console.log(data);
}

function setTemplate (template) {
    console.log(template);
}

function init (config) {
    var self = this;
    
    // TODO only for dev
    self.config = devConfig;
    
    self.on('setData', setData);
    self.on('setTemplate', setTemplate);
    
    // listen to external events
    Events.call(self, self.config);
    
    self.emit('ready');
}

module.exports = init;


return module; });