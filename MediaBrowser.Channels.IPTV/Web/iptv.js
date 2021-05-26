var IPTVConfigurationPage = {
    pluginUniqueId: "a59b5c4b-05a8-488f-bfa8-7a63fffc7639",

    populateStreamList: function (page) {
        var streams = IPTVConfigurationPage.config.Bookmarks;
        var html = "";

        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];

            html += '<div class="listItem">';
            html += '<span class="material-icons listItemIcon live_tv"></span>';
            html += '<div class="listItemBody two-line">';
            html += '<h3 class="listItemBodyText">';
            html += stream.Name;
            html += '</h3>';
            html += '</div>';
            html += '<button type="button" is="paper-icon-button-light" class="btnDeleteStream listItemButton" data-deleteStreamindex="' + i + '" title="Delete"><span class="material-icons delete"></span></button>';
            html += '</div>';
        }

        var streamList = page.querySelector('.streamList');
        streamList.innerHTML = html;

        if (streams.length) {
            streamList.classList.remove('hide');
        } else {
            streamList.classList.add('hide');
        }
    },
    /*deleteStream: function (button, index) {
        var msg = "Are you sure you wish to delete this bookmark?";

        Confirm(msg, "Delete Bookmark").then(function () {
                IPTVConfigurationPage.config.Bookmarks.splice(index, 1);
                //var page = button.closest('.page')[0];

                IPTVConfigurationPage.save();
                IPTVConfigurationPage.populateStreamList(page, IPTVConfigurationPage.config.Bookmarks);
            });
    },*/
    
    addStreamPopup: function (page) {
        page.querySelector('#Name').value = "";
        page.querySelector('#streamPopup').classList.remove('hide');
        page.querySelector('#Name').focus();                    
    },
    save: function () {
        Dashboard.showLoadingMsg();

        ApiClient.getPluginConfiguration(IPTVConfigurationPage.pluginUniqueId).then(function (config) {
            config.Bookmarks = IPTVConfigurationPage.config.Bookmarks;
            ApiClient.updatePluginConfiguration(IPTVConfigurationPage.pluginUniqueId, config).then(Dashboard.processPluginConfigurationUpdateResult);
        });
    }
};

export default function (view, params) {
    var page = view;
    /*view.addEventListener('viewbeforeshow', function(event){
        var page = this;

        
    });*/

    view.querySelector('.streamList').addEventListener('click', function (e) {
        let index;
        var msg = "Are you sure you wish to delete this bookmark?";
        Confirm(msg, "Delete Bookmark").then(function () {
            const btnDeleteStream = e.target.closest('.btnDeleteStream');
            if (btnDeleteStream) {
                index = parseInt(btnDeleteStream.getAttribute('data-deleteStreamindex'));
                IPTVConfigurationPage.config.Bookmarks.splice(index, 1);
                IPTVConfigurationPage.save();
                IPTVConfigurationPage.populateStreamList(page);
            }   
        });     
    });

    view.addEventListener('viewshow', function(event){
        Dashboard.showLoadingMsg();
        var page = this;

        ApiClient.getPluginConfiguration(IPTVConfigurationPage.pluginUniqueId).then(function (config) {
            IPTVConfigurationPage.config = config;
            IPTVConfigurationPage.populateStreamList(page);
            Dashboard.hideLoadingMsg();
        });
    });

    view.querySelector('.btnAdd').addEventListener('click', function () {
        IPTVConfigurationPage.addStreamPopup(page);
    });

    view.querySelector('.button-cancel').addEventListener('click', function () {
        page.querySelector('#streamPopup').classList.add('hide');
    });

    view.querySelector('#streamForm').addEventListener('submit', function (e) {
        page.querySelector('#streamPopup').classList.add('hide');
        var form = this;

        var newEntry = true;
        var name = form.querySelector('#Name').value;
        var image = form.querySelector('#Image').value;
        var url = form.querySelector('#URL').value;
        var type = form.querySelector('#Type').value;
        var userId = Dashboard.getCurrentUserId();

        if (IPTVConfigurationPage.config.Bookmarks.length > 0) {
            for (var i = 0, length = IPTVConfigurationPage.config.Bookmarks.length; i < length; i++) {
                if (IPTVConfigurationPage.config.Bookmarks[i].Name == name) {
                    newEntry = false;
                    IPTVConfigurationPage.config.Bookmarks[i].Image = image;
                    IPTVConfigurationPage.config.Bookmarks[i].Path = url;
                    IPTVConfigurationPage.config.Bookmarks[i].Protocol = type;
                    IPTVConfigurationPage.config.Bookmarks[i].UserId = userId;
                }
            }
        }

        if (newEntry) {
            var conf = {};

            conf.Name = name;
            conf.Image = image;
            conf.Path = url;
            conf.Protocol = type;
            conf.UserId = userId;
            IPTVConfigurationPage.config.Bookmarks.push(conf);
        }
        IPTVConfigurationPage.save();
        IPTVConfigurationPage.populateStreamList(page);
        e.preventDefault();
        return false;
    });
}