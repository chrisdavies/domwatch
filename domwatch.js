(function (win) {
    var handlers = [];

    function matches(node, selector) {
        var match = (node.matches ||
                node.webkitMatchesSelector ||
                node.msMatchesSelector ||
                node.mozMatchesSelector ||
                node.oMatchesSelector);

        return match && match.call(node, selector);
    }

    function all(node, handler, fnName) {
        var selector = handler.filter;
        matches(node, selector) && handler[fnName](node);
        node.querySelectorAll && each(node.querySelectorAll(selector), handler[fnName]);
    }

    function each(arr, fn) {
        for (var i = 0; i < arr.length; ++i) fn(arr[i], i);
    }

    function domwatch(handler) {
        if (handlers.indexOf(handler) >= 0) return;
        var empty = function () { };
        handler.added = handler.added || empty;
        handler.removed = handler.removed || empty;
        handlers.push(handler);
    }

    function domunwatch(handler) {
        var i = handlers.indexOf(handler);
        i >= 0 && handlers.splice(i, 1);
    }

    function handleOne(node, fnName) {
        each(handlers, function (handler) {
            matches(node, handler.filter) && handler[fnName](node);
        });
    }

    function handleMany(nodes, fnName) {
        each(nodes, function (node) {
            each(handlers, function (handler) {
                all(node, handler, fnName);
            });
        });
    }
    
    document.addEventListener("DOMContentLoaded", function () {
        var MO = win.MutationObserver || win.WebKitMutationObserver;
        if (MO) {
            new MO(function (mutations) {
                each(mutations, function (mutation) {
                    handleMany(mutation.addedNodes, 'added');
                    handleMany(mutation.removedNodes, 'removed');
                });
            }).observe(document, { subtree: true, childList: true });
        } else {
            document.addEventListener('DOMNodeInserted', function (a) { handleOne(a.target, 'added'); }, false);
            document.addEventListener('DOMNodeRemoved', function (r) { handleOne(r.target, 'removed'); }, false);
        }

        handleMany([document.body], 'added');
    });

    win.domwatch = domwatch;
    win.domunwatch = domunwatch;
})(window);