M.wrap('github/jillix/crud-links/dev/links.js', function (require, module, exports) {
var devConfig = {
    
};

function init (config) {
    var self = this;
    
    // TODO only for dev
    self.config = devConfig;

    console.log('crud-links init');
}

module.exports = init;


return module; });