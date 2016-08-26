var $FeedContainer = $('#FeedContainer', document);
$.get('https://graph.facebook.com/gawdsnitkkr/feed?access_token=1190755740976083|8d59f9b9119f123e50533bee27e34453',
    function (response) {
        var Data = response.data;
        $FeedContainer.html('');
        for (var i = 0; i < Data.length; i++) {
            if (typeof Data[i].message !== 'undefined') {
                $FeedContainer.append('<div class="Feed">' + Data[i].message + '</div>');
            }
        }
    });