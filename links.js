M.wrap('github/jillix/crud-links/dev/links.js', function (require, module, exports) {

var clone = require('./clone');
var Events = require('github/jillix/events');

function setData (data) {
    var self = this;
}

function setTemplate (template, force) {
    var self = this;

    // TODO this is a hack until bind knows how select keys in parameters
    var template = typeof template === 'string' ? template : (template.id || template._id);
    if (!template) {
        // cleanup on error
        self.linksTarget.innerHTML = '';
        // TODO handle error
        return;
    }

    // nothing to do if the same template
    if (!force && self.template && self.template._id === template) {
        return;
    }

    // reset links target html
    self.linksTarget.innerHTML = '';

    self.emit('getTemplates', [template], function (err, templates) {
        
        template = templates[template];
        if (!template || !template.links) {
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
        self.off('hideForm');
    
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
        self.linksTarget.appendChild(df);
    });
}

function hideForm () {
    var self = this;
    
    if (self.formTarget) {
        self.formTarget.style.display = "none";
    }
}

function init (config) {
    var self = this;
    self.config = config;
    self.linksTarget = self.dom.querySelector(self.config.linksTarget);
    // TOOD make it configurable
    self.formTarget = self.dom.querySelector('.amount-popup-container');

    self.on('setTemplate', setTemplate);
    self.on('hideForm', hideForm);

    // listen to external events
    Events.call(self, self.config);
    
    self.emit('ready');
}

module.exports = init;

return module; });
