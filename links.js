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
    var self = this;
    
    if (template && template.links instanceof Array) {
        var filterDefault = self.config.clones.filter;
        var tableDefault = self.config.clones.table;
        for (var i = 0, l = template.links.length; i < l; ++i) {
            if (!template.links[i].tableOnly) {
                M.clone('#linksContainer', 'data_filter', '_links_' + i, filterDefault.config);
            }
            M.clone('#linksContainer', 'data_table', '_links_' + i, tableDefault.config);
           
            /*
                TODO:
                - define ui and interaction
                    - ui config for crud-links
                - define event flow
                - create config for filter
                    - take schema from link
                - create config for table
                    - columns are defined in the filter query (fields)
                - clone data_filter module
                - clone data_table module
                - add relations to accordion
            */
        }
    }
}

function init (config) {
    var self = this;
    
    // TODO only for dev
    self.config = devConfig;
    self.config.clones = config.clones;
    
    self.on('setData', setData);
    self.on('setTemplate', setTemplate);
    
    // listen to external events
    Events.call(self, self.config);
    
    self.emit('ready');
}

module.exports = init;

return module; });
