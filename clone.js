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
        if (!obj.hasOwnProperty(i)) return;

        cloneO[i] = cloneJSON(obj[i]);
    }
    return cloneO;
}

function hideFilterAndRefreshForm (filterCloneMiid) {
    var self = this;
    
    if (self.formTarget) {
        self.formTarget.style.display = "none";
    }
    
    if (self.clones[filterCloneMiid]) {
        self.clones[filterCloneMiid].emit('refresh');
    }
}

function clone (link, filter, table) {
    var self = this;
    
    self.emit('getTemplates', [link.template], function (err, templates) {

        if (err || !templates) {
            return;
        }
        
        var linkTemplate;
        if (!(linkTemplate = templates[link.template])) {
            return;
        }
        
        // we clone the default configurations because they will be modified by the modules
        var filterConfig = cloneJSON(self.config.clones.filter.config) || {};
        var tableConfig = cloneJSON(self.config.clones.table.config) || {};
        
        // the clone miids
        var filterCloneMiid = self.config.clones.filter.miid + '_' + self.template.id + '_' + linkTemplate.id;
        var tableCloneMiid = self.config.clones.table.miid + '_' + self.template.id + '_' + linkTemplate.id;
        
        // let CRUD know that he should listen to this new filter module
        self.emit('listenTo', [filterCloneMiid]);
        
        // overwrite html
        if (link.filter && link.filter.html) {
            filterConfig.html = link.filter.html;
        }
        
        // the filter must wait for the table to load because it will notify the table about the template
        filterConfig.waitFor = filterConfig.waitFor || [];
        filterConfig.waitFor.push(tableCloneMiid);
        
        // configure the filter to listen to the table module
        filterConfig.listen = filterConfig.listen || {};
        filterConfig.listen[tableCloneMiid] = {
            setOptions: [ { emit: 'setOptions' } ]
        };

        // add a new miid into i18n miid list
        self.emit("i18nListen", filterCloneMiid);

        // configure the table to listen to the filter module
        tableConfig.listen = tableConfig.listen || {};
        tableConfig.listen[filterCloneMiid] = {
            result: [ { handler: 'renderItemsFromResult' } ],
            template: [ { handler: 'setTemplate' } ],
            filtersChanged: [ { handler: 'clearSkip' } ]
        };
        
        // configure crud links ui events
        if (link.table) {
            
            self.on(link.table.event || 'selectionChanged', tableCloneMiid, function (selection) {
                
                self.emit('resetForm');
                
                // set template on link form
                self.emit('setFormTemplate', link.saveIn || linkTemplate.id, function () {
                    
                    // show form
                    if (self.formTarget) {
                        self.formTarget.style.display = "block";
                    }
                    
                    // build query
                    var query = {};
                    if (link.table.query) {
                        for (var field in link.table.query) {
                            
                            if (!link.table.query.hasOwnProperty(field)) {
                                return;
                            }
                            
                            if (link.table.query[field].indexOf('#') === 0) {
                                var _field = link.table.query[field].substr(1);
                                query[field] = selection[_field];
                            } else {
                                query[field] = self.data[link.table.query[field]];
                            }
                        }
                        
                        self.emit('setFormData', query, query);
                    } else {
                        self.emit('setFormData', selection);
                    }
                });
            });
        }

        // links with table only option have only a filter with no UI
        if (linkTemplate.tableOnly && filterConfig.ui) {
            delete filterConfig.ui;
        }
        
        // handle on dataSet
        self.on('setData', function (data) {
            
            self.data = data;
            
            if (link.filter && link.filter.onDataSet) {
                var filters = [];
                for (var i = 0, l = link.filter.onDataSet.length; i < l; ++i) {
                    filters.push({
                        field: link.filter.onDataSet[i].field,
                        operator: link.filter.onDataSet[i].operator,
                        value: data[link.filter.onDataSet[i].value],
                        fixed: true,
                        hidden: true
                    });
                }
                
                self.clones[filterCloneMiid].emit('setFilters', filters, true);
            }
        });
        
        // set up events when filter is ready
        self.once('ready', filterCloneMiid, function() {
            
            self.on('saved', self.config.formMiid, function () {
                hideFilterAndRefreshForm.call(self, filterCloneMiid);
            });
            
            self.on('removed', self.config.formMiid, function () {
                hideFilterAndRefreshForm.call(self, filterCloneMiid);
            });
            
            self.on('reset', self.config.formMiid, function () {
                hideFilterAndRefreshForm.call(self, filterCloneMiid);
            });
            
            // emit a special event to set the template for this filter module
            if (!(link.filter && link.filter.dontLoad)) {
                self.clones[filterCloneMiid].emit('setTemplate', linkTemplate.id);
            }
            
            if (link.filter && link.filter.onDataSet) {
                self.clones[filterCloneMiid].emit('setTemplate', linkTemplate.id, true);
            }
            
            // handle show form button
            if (link.showForm) {
                var showForm = filter.querySelector(link.showForm.selector);
                if (showForm) {
                    showForm.addEventListener(link.showForm.event || 'click', function () {
                        
                        self.emit('resetForm');
                        
                        // set template on link form
                        self.emit('setFormTemplate', link.saveIn || linkTemplate.id, function () {
                            
                            // set data on form
                            if (link.showForm.data) {
                                var setData = {};
                                for (var key in link.showForm.data) {
                                    
                                    if (self.data[link.showForm.data[key]]) {
                                        setData[key] = self.data[link.showForm.data[key]];
                                    } else if (link.showForm.data[key][0] === '#') {
                                        setData[key] = link.showForm.data[key].substr(1);
                                    } 
                                }
                                
                                self.emit('setFormData', setData, false);
                            }
                            
                            // show form
                            if (self.formTarget) {
                                self.formTarget.style.display = "block";
                            }
                        });
                    }, false);
                }
            }
            
            // add title to links
            if (link.title && linkTemplate.options && linkTemplate.options.label) {
                var title = filter.querySelector(link.title);
                if (title) {
                    title.innerHTML = linkTemplate.options.label[M.getLocale()];
                }
            }
        });
        
        // clone the filters for this link
        M.clone(filter, self.config.clones.filter.miid, '_' + self.template.id + '_' + linkTemplate.id, filterConfig, function(module) {
            self.clones[filterCloneMiid] = module;
        });
        
        // clone the table for this link
        M.clone(table, self.config.clones.table.miid, '_' + self.template.id + '_' + linkTemplate.id, tableConfig, function(module) {
            self.clones[tableCloneMiid] = module;
        });
    });
}

module.exports = clone;

return module; });
