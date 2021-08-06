var __data = readFromStorage(sessionStorage, 'tct-profile-disabler-data');

__data = __data || resetData();

function resetData() {
    return {
        debug: true,
        accounts: undefined,
        selectedAccount: undefined,
        profiles: undefined,
        selectedProfiles: undefined,
        areProfilesSelected: false,
        loading: true,
        finished: false,
    }
}

function restart() {
    __data = resetData()
    commitData(__data);
    getAccounts();
}

function readFromStorage(storage, key) {
    var value = storage.getItem(key);
    try {
        value = JSON.parse(value)
    } catch (e) {
        value = {}
    }
    return value;
}

function writeToStorage(storage, key, value) {
    var valueStr = JSON.stringify(value);
    storage.setItem(key, valueStr)
}

function commitData(data) {
    writeToStorage(sessionStorage, 'tct-profile-disabler-data', data);
    tTools.send(data);
}

function errorHandler(e) {
    __data.loading = false;

    if (typeof e === "string" && e.indexOf("Users must be authenticated") > -1)
        __data.error = "You are not authenticated. Please log in to tealium and try again."
    else
        __data.error = e;
    console.error(e);
    commitData(__data);
}

function getAccounts() {
    __data.loading = true;

    __data.__accounts = undefined;
    __data.selectedAccount = undefined;
    __data.profiles = undefined;
    __data.selectedProfiles = undefined;
    __data.areProfilesSelected = false;
    __data.error = undefined;
    commitData(__data);

    tTools.getAccounts(function success(data) {
        __data.loading = false;
        __data.accounts = data.accounts.sort();
        commitData(__data);
    },
    errorHandler
    )

}

function getProfiles(data) {
    __data.loading = true;
    __data.profiles = undefined;
    __data.selectedProfiles = undefined;
    __data.error = undefined;
    __data.selectedAccount = data.account;
    commitData(__data)

    var selectedAccount = data.account
    tTools.getProfiles(
        selectedAccount,
        function success(data) {
            console.log(data)
            __data.loading = false;
            __data.profiles = data.profiles.sort();
            commitData(__data);
        },
        errorHandler
        )

}

function selectProfiles(data) {
    console.log(data);
    __data.selectedProfiles = data.profiles.sort()
    __data.areProfilesSelected = true;
    commitData(__data);
}

function changeProfileSelection() {
    __data.areProfilesSelected = false;
    __data.selectedProfiles = undefined;
    commitData(__data);
}

function disableProfiles(data) {
    var profiles = __data.selectedProfiles || [];
    if (profiles.length === 0) {
        tTools.sendMessage('Finished', 'Operation have been finished.')
        return;
    }
    if (!window.utui || !window.utui.automator) {
        tTools.sendError('Error', "Please go to <a href=\"https://my.tealiumiq.com\">Tealium iQ</a> and log in.");
        return;
    }
    if (!__data.selectedAccount) {
        __data = resetData()
        tTools.sendError('Error', 'Data structure corrupted. Please try again or report this problem with steps you\'ve taken')
        commitData(__data);
        return
    }

    var currentDate = utui.util.date.getSaveAsDate(new Date());
    var toProcess = []
    for (var i in profiles) {
        var profile = profiles[i];
        toProcess.push({
            account: __data.selectedAccount,
            profile: profile,
            dev: (data['env-dev'] === true),
            qa: (data['env-qa'] === true),
            prod: (data['env-prod'] === true),
            title: "Disable Profile: " + currentDate,
            notes: "Profile Disabler: Disabled Profile From Running On Page"
        })
    }
    utui.automator.run(toProcess, function () {
        utui.automator.addExtension({
            id: 100036,
            status: "active",
            title: "Profile Disabler: Disable Profile Loading"
          }, function (ext_id) {
            utui.automator.updateExtensionValue(ext_id, 'code', 'window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};\nwindow.utag_cfg_ovrd.noload = true;')
            utui.automator.updateExtensionValue(ext_id, 'advExecOption', 'alr')
            utui.automator.updateExtensionValue(ext_id, 'scope', 'preload')
    
          })
    })
    __data.finished = true;
    commitData(__data);
}

function debug() {
    debugger;
}

if (__data.loading) {
    getAccounts()
}

commitData(__data)