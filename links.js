M.wrap('github/jillix/crud-links/dev/links.js', function (require, module, exports) {

var clone = require('./clone');
var Events = require('github/jillix/events');

function setData (data) {
    var self = this;
}

function setTemplate (template) {
    
    var self = this;
    
    if (!template || !template.links || (self.template && self.template._id === template._id)) {
        return;
    }

    self.template = template;
    
    // uninit the clones
    for (var cloneMiid in self.clones) {
        self.uninit(cloneMiid);
    }
    // empty the clone cache
    self.clones = {};
    
    // delete events
    self.off('setData');
    self.off('selectionChanged');

    // nothing to do when there are no links
    if (!template.links) {
        return;
    }
    
    // append links in order
    var df = document.createDocumentFragment();
    for (var i = 0, l = template.links.length; i < l; ++i) {
        
        // append dom in order
        var filter = document.createElement('div');
        var table = document.createElement('div');
        filter.setAttribute('id', 'filter_' + i);
        table.setAttribute('id', 'table_' + i);
        df.appendChild(filter);
        df.appendChild(table);
        
        // append a hr element at the end of a relation
        // except the for the last relation
        if (i !== (template.links.length - 1)) {
            df.appendChild(document.createElement('hr'));
        }
        
        // create links
        clone.call(self, template.links[i], filter, table); 
    }
    
    // append document fragment to the dom
    self.linksTarget.innerHTML = '';
    self.linksTarget.appendChild(df);  
}

function init (config) {
    var self = this;
    self.config = config;
    self.linksTarget = self.dom.querySelector(self.config.linksTarget);

    self.on('setTemplate', setTemplate);

    // listen to external events
    Events.call(self, self.config);
    
    self.emit('ready');
}

module.exports = init;

return module; });
