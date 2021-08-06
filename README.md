# Profile Disabler

This is a [Tealium Tools](https://chrome.google.com/webstore/detail/tealium-tools/gidnphnamcemailggkemcgclnjeeokaa) - Custom Tool which creates extension that will disable running Tealium iQ on the page.

# Installation

To install this tool:

1. Open Tealium Tools
2. Go to Custom Tools tab.
3. Click + Button
4. Switch to Add Custom Tools tab
5. Paste the following address into the Add bu URL field: https://adamolczak.github.io/tiq_profile_disabler/profile-disabler.json
6. Click Add Custom Tool button
7. You will find the tool in the Custom Tools tab named Profile Disabler

# Usage
To use it you need to login to Tealium iQ

1. (if not done already) Go to https://my.tealiumiq.com and login with your account details
2. Launch Profile Disabler from Tealium Tools - Custom Tools section
3. The list of accounts should be loaded.
4. Select the account which you want to load profile list from and click Select Account
5. Select Profiles which you want to disable (you can use Ctrl/Cmd and Shift to select multiple profiles) and click Select Profiles
6. Review the selected profiles
7. Select environments you want to publish to.
8. Click "Yes, disable" button, if everything is correct, or "Change or Cancel" button if you need to change the selection.
9. The process has been started.

# Known issues
When going back to change the selection of profiles, previously selected profiles are not selected again. - That is not possible to implement due to how Tealium Tools work.

There's no information when the process finishes. - Unfortunately I'm not able to detect when that happens due to asynchronous nature of the process and Automator Library not providing a possibility of responding to that.

The extension is not placed at the top of extension list. - Introduction of Load Order Manager broke the classic sorting mechanism. Looking for alternative solution.