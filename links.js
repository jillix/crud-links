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

    if (!template || (self.template && self.template._id === template._id)) {
        return;
    }

    self.template = template;

    // uninit the clones
    for (var cloneMiid in self.clones) {
        self.uninit(cloneMiid);
    }

    // empty the clone cache
    self.clones = {};

    // nothing to do when there are no links
    if (!template.links) {
        return;
    }

    for (var i = 0, l = template.links.length; i < l; ++i) {
        var targetTemplateId = template.links[i]._tp;
        // we clone the default configurations because they will be modified by the modules
        var filterConfig = cloneJSON(self.config.clones.filter.config) || {};
        var tableConfig = cloneJSON(self.config.clones.table.config) || {};
        // the clone miids
        var filterCloneMiid = self.config.clones.filter.miid + '_' + template._id + '_' + targetTemplateId;
        var tableCloneMiid = self.config.clones.table.miid + '_' + template._id + '_' + targetTemplateId;

        // let CRUD know that he should listen to this new filter module
        self.emit('listenTo', [filterCloneMiid]);

        // the filter must wait for the table to load because it will notify the table about the template 
        filterConfig.waitFor = filterConfig.waitFor || [];
        filterConfig.waitFor.push(tableCloneMiid);
        // configure the table to listen to the filter module
        filterConfig.listen = filterConfig.listen || {};
        filterConfig.listen[self.miid] = {};
        filterConfig.listen[self.miid][filterCloneMiid + '_setTemplate'] = [ { emit: 'setTemplate' } ];

        // configure the table to listen to the filter module
        tableConfig.listen = tableConfig.listen || {};
        tableConfig.listen[filterCloneMiid] = {
            result: [ { handler: 'renderItemsFromResult' } ],
            template: [ { handler: 'setTemplate' } ],
            filtersChanged: [ { handler: 'clearSkip' } ]
        };

        // links with table only option have only a filter with no UI
        if (template.links[i].tableOnly && filterConfig.ui) {
            delete filterConfig.ui;
        }

        // emit a special event to set the template for this filter module
        (function(targetTemplateId){
            self.on('ready', filterCloneMiid, function() {
                self.emit(filterCloneMiid + '_setTemplate', targetTemplateId);
            });
        })(targetTemplateId);

        // clone the filters for this link
        M.clone('#linksContainer', self.config.clones.filter.miid, '_' + template._id + '_' + targetTemplateId, filterConfig, (function(filterCloneMiid) {
            return function(module) {
                self.clones[filterCloneMiid] = module;
            };
        })(filterCloneMiid));

        // clone the table for this link
        M.clone('#linksContainer', self.config.clones.table.miid, '_' + template._id + '_' + targetTemplateId, tableConfig, (function(tableCloneMiid) {
            return function(module) {
                self.clones[tableCloneMiid] = module;
            };
        })(tableCloneMiid));
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
