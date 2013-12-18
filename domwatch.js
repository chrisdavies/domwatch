(function (win) {
    function matches(node, selector) {
        return (node.matches ||
                node.webkitMatchesSelector ||
                node.msMatchesSelector ||
                node.mozMatchesSelector ||
                node.oMatchesSelector).call(node, selector);
    }

    function each(arr, fn) {
        for (var i = 0; i < arr.length; ++i) fn(arr[i], i);
    }

    function attr(n, name) {
        return n.getAttribute && n.getAttribute(name);
    }

    var rootHandler = {
        _wd: {
            added: function () { },
            removed: function () { },
        }
    }

    function watchdom(handler) {
        if (handler._wd) return;

        var wd = {
            parent: undefined,
            child: rootHandler
        },
            handles = function () { return true; };

        rootHandler.parent = handler;
        handler._wd = wd;

        if (handler.filter) handles = function (n) {
            return matches(n, handler.filter);
        };

        function addFn(fnName) {
            if (handler[fnName]) {
                wd[fnName] = function (n) {
                    if (handles(n)) handler[fnName](n);

                    this.child._wd[fnName](n);
                };
            } else {
                wd[fnName] = function (n) {
                    this.child._wd[fnName](n);
                };
            }
        }

        addFn('added');
        addFn('removed');
        rootHandler = handler;
    }

    function unwatchdom(handler) {
        var wd = handler._wd;
        if (rootHandler == handler) {
            rootHandler = wd.child;
            rootHandler._wd.parent = undefined;
        } else {
            wd.parent.child = wd.child;
            wd.child.parent = wd.parent;
        }

        handler._wd = undefined;
    }

    function add(n) {
        rootHandler._wd.added(n);
    }

    function remove(n) {
        rootHandler._wd.removed(n);
    }
    
    var MO = win.MutationObserver || win.WebKitMutationObserver;
    if (MO) {
        new MO(function (mutations) {
            each(mutations, function (mutation) {
                each(mutation.addedNodes, add);
                each(mutation.removedNodes, remove);
            });
        }).observe(document.body, { subtree: true, childList: true });
    } else {
        document.addEventListener('DOMNodeInserted', function (a) { add(a.target); }, false);
        document.addEventListener('DOMNodeRemoved', function (r) { remove(r.target); }, false);
    }

    win.watchdom = watchdom;
    win.unwatchdom = unwatchdom;
})(window);
