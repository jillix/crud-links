crud-links
==========

Display relations of a crud item

####Configuration
```js
links: [{
    // the template that is used for filter and table
    template: hbLogTemplateId,
    
    // the template that is used for the form (optional)
    // if not set the main template above is used.
    saveIn: 'templateId'
    
    // filter settings
    filter: {
        
        // prevent filter from loading data on init
        dontLoad: true,
        
        // set a custom html for the filter
        html: '/html/data/hb/link_filter_customer_log.html',
        
        // on dataSet update filter
        onDataSet: [{
            field: 'customer',
            operator: '=',
            value: '_id' // this is a key of the setData object
        }]
    },
    
    // table settings
    table: {
        // define a event to show the form
        event: 'selectionChange',
        
        // tell form to get a item with this query
        query: {
            fieldA: '_id' // this is a key of the setData object
            fiedlB: '#_id' // this is a key of the selection object
        }
    },
    
    // show form dom element
    showForm: {
    
        // the selector for the dom element
        selector: 'button[name=showForm]',
        
        // the event-name for the dom event
        event: 'click',
        
        // set data on the form
        data: {
            customer: '_id', // this is a key of the setData object
            type: '#manual' // set a value in form
        }
    }
}]
```
