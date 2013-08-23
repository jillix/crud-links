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
    
    var config = {
        html: '/html/data/form_template_article_caller.html',
        waitFor: ['crud'],
        template: []
    };
    
    // test module cloning
    M.clone('#dataLinksContainer', 'data_form', 'Relation', config);
    M.clone('#dataLinksContainer', 'data_table', 'Relation', config);
    
    if (template && template.links instanceof Array) {
        for (var i = 0, l = template.links.length; i < l; ++i) {
            //console.log(template.links[i]);
            
            // load filter...
            // load tabel...
        }
    }
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
