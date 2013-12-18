# domwatch

A flexible, efficient DOM watcher library for modern browsers. This allows you to react to elements being added or removed from the DOM, and efficiently supports any number of different watchers.

0.6KB minified and gzipped.

## Watching the DOM for changes
To begin watching the DOM, add one or more handlers like this:

    var watcher = {
        filter: 'time.foo',
        
        added: function (n) {
            alert('Added a time.foo element!');
        },
        
        removed: function (n) {
            alert('Removed a time.foo element!');
        }
    }
    
    watchdom(watcher);
    
In this example, the watcher object is only watching for 'time.foo' elements. If no filter is supplied, then the added/removed functions will be called for every element that is added to the DOM.

## Stop watching the DOM
To stop watching the DOM, simply remove your watcher like this:

    unwatchdom(watcher);
    
## Additional notes
You can add and remove watchers at any time, and there is no limit to the number of watchers you add.

## License
No license. Feel free to fork, modify and do whatever you want with no attribution. If you think your changes would be useful to this project, feel free to send a pull-request.
