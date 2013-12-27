var w = {
    filter: 'span.name',
    added: function (n) {
        alert('Added: ' + n.innerHTML);
    }
};

domwatch(w);

window.setTimeout(function () {
    var n = document.createElement('div');
    n.innerHTML = '<span class="name">Sam Burger</span>';
    document.getElementsByTagName('div')[0].appendChild(n);
}, 500);