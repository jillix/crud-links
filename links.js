M.wrap('github/jillix/crud-links/dev/links.js', function (require, module, exports) {

var Events = require('github/jillix/events');

// function to clone a JSON object (it wil not clone function, dates, etc.)
function cloneJSON(obj) {
    // basic type deep copy
    if (obj === null || obj === undefined || typeof obj !== 'object')  {
        return obj
    }
    // array deep copy
    if (obj instanceof Array) {
        var cloneA = [];
        for (var i = 0; i < obj.length; ++i) {
            cloneA[i] = cloneJSON(obj[i]);
        }
        return cloneA;
    }
    // object deep copy
    var cloneO = {};
    for (var i in obj) {
        cloneO[i] = cloneJSON(obj[i]);
    }
    return cloneO;
}

function setData (data) {
    //console.log(data);
}

function setTemplate (template) {
    var self = this;
    
    if (!template || !template.links instanceof Array) {
        return;
    }

    for (var i = 0, l = template.links.length; i < l; ++i) {
        // we clone the default configurations because they will be modified by the modules
        var filterConfig = cloneJSON(self.config.clones.filter.config) || {};
        var tableConfig = cloneJSON(self.config.clones.table.config) || {};

        if (!template.links[i].tableOnly && filterConfig.ui) {
            delete filterConfig.ui;
        }

        M.clone('#linksContainer', self.config.clones.filter.miid, '_' + template._id, filterConfig);
        M.clone('#linksContainer', self.config.clones.table.miid, '_' + template._id, tableConfig);
    }
}

function init (config) {
    var self = this;
    self.config = config;

    self.on('setData', setData);
    self.on('setTemplate', setTemplate);

    // listen to external events
    Events.call(self, self.config);

    self.emit('ready');
}

module.exports = init;

return module; });
