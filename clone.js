M.wrap('github/jillix/crud-links/dev/clone.js', function (require, module, exports) {

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

function clone (link, filter, table) {
    var self = this;
    
    self.emit('getTemplates', [link.template], function (err, templates) {
        
        var linkTemplate;
        if (!(linkTemplate = templates[link.template])) {
            return;
        }
        
        // we clone the default configurations because they will be modified by the modules
        var filterConfig = cloneJSON(self.config.clones.filter.config) || {};
        var tableConfig = cloneJSON(self.config.clones.table.config) || {};
        
        // the clone miids
        var filterCloneMiid = self.config.clones.filter.miid + '_' + self.template._id + '_' + linkTemplate.id;
        var tableCloneMiid = self.config.clones.table.miid + '_' + self.template._id + '_' + linkTemplate.id;
        
        // let CRUD know that he should listen to this new filter module
        self.emit('listenTo', [filterCloneMiid]);
        
        // the filter must wait for the table to load because it will notify the table about the template
        filterConfig.waitFor = filterConfig.waitFor || [];
        filterConfig.waitFor.push(tableCloneMiid);
        
        // configure the filter to listen to the table module
        filterConfig.listen = filterConfig.listen || {};
        filterConfig.listen[tableCloneMiid] = {
            setOptions: [ { emit: 'setOptions' } ]
        };
        
        // configure the table to listen to the filter module
        tableConfig.listen = tableConfig.listen || {};
        tableConfig.listen[filterCloneMiid] = {
            result: [ { handler: 'renderItemsFromResult' } ],
            template: [ { handler: 'setTemplate' } ],
            filtersChanged: [ { handler: 'clearSkip' } ]
        };
        
        // configure crud links ui events
        self.on('selectionChanged', tableCloneMiid, function () {
            console.log(link.table);
            //self.emit('setFormTemplate', link.table.template);
        });

        // links with table only option have only a filter with no UI
        if (linkTemplate.tableOnly && filterConfig.ui) {
            delete filterConfig.ui;
        }
        
        // set up events when filter is ready
        self.once('ready', filterCloneMiid, function() {
            
            // emit a special event to set the template for this filter module
            if (!(link.filter && link.filter.dontLoad)) {
                self.clones[filterCloneMiid].emit('setTemplate', linkTemplate.id);
            }
            
            // handle on dataSet
            if (link.onDataSet) {
                
                self.on('setData', function (data) {
                    
                    self.clones[filterCloneMiid].once('template', function (template) {
                        var filters = [];
                        for (var i = 0, l = link.onDataSet.length; i < l; ++i) {
                            filters.push({
                                field: link.onDataSet[i].field,
                                operator: link.onDataSet[i].operator,
                                value: data[link.onDataSet[i].value],
                                fixed: true,
                                hidde: true
                            });
                        }
                        
                        self.clones[filterCloneMiid].emit('setFilters', filters, true);
                    });
                    
                    self.clones[filterCloneMiid].emit('setTemplate', linkTemplate.id, true);
                });
            }
        });
        
        // clone the filters for this link
        M.clone(filter, self.config.clones.filter.miid, '_' + self.template._id + '_' + linkTemplate.id, filterConfig, function(module) {
            self.clones[filterCloneMiid] = module;
        });
        
        // clone the table for this link
        M.clone(table, self.config.clones.table.miid, '_' + self.template._id + '_' + linkTemplate.id, tableConfig, function(module) {
            self.clones[tableCloneMiid] = module;
        });
    });
}

module.exports = clone;

return module; });