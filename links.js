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
        "html": "/html/data/filters.de.html",
        "css": ["/css/filter.css"],
        "waitFor": [
            "crud",
            "data_table",
            "i18n"
        ],
        "i18n": true,
        "ui": {
            "events": {
                "add": "click",
                "cancel": "click",
                "create": "click",
                "remove": "click",
                "itemEdit": "click",
                "itemRemove": "click"
            },
            "filter": ".filter",
            "list": ".filter-list",
            "listItem": "li",
            "valueLabel": ".valueLabel",
            "valueField": ".valueField",
            "inputs": {
                "field": "select[name=field]",
                "operator": "select[name=operator]"
            },
            "controls": {
                "create": "button[name=create]",
                "save": "button[name=save]",
                "cancel": "button[name=cancel]",
                "remove": "button[name=remove]"
            },
            "item": {
                "onoff": ".onoff",
                "field": ".field",
                "operator": ".operator",
                "value": ".value",
                "remove": ".remove",
                "edit": ".edit"
            }
        },
        "listen": {
            "data_list_templates": {
                "selectionChanged": [
                    { "emit": "setTemplate" }
                ]
            },
            "data_table": {
                "sort": [
                    { "emit": "setOptions" }
                ]
            }
        }
    };
    
    // test module cloning
    M.clone('#linksContainer', 'data_filter', '_links', config);
    
    config.html = '/html/data/data_table.de.html';
    config.template = [];
    M.clone('#linksContainer', 'data_table', '_links', config);
    
    if (template && template.links instanceof Array) {
        for (var i = 0, l = template.links.length; i < l; ++i) {
            /*
                TODO:
                - define ui and interaction
                - define event flow
                - add relations to accordion
                - create config for filter
                - create config for table
                - clone data_filter module
                - clone data_table module
            */
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
