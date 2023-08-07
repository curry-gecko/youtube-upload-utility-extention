function handleMutation(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function (node) {
                if (node instanceof Element) {
                    let ReuseDialog = node.classList.contains('ytcp-uploads-reuse-details-selection-dialog')
                        ? node
                        : node.querySelector('.ytcp-uploads-reuse-details-selection-dialog');
                    if (ReuseDialog != null) {
                        uncheckReuseSettingsDialog(ReuseDialog);
                    }

                    let uploadsDialog = node.classList.contains('ytcp-uploads-dialog')
                        ? node
                        : node.querySelector('.ytcp-uploads-dialog');
                    if (uploadsDialog != null) {
                        uncheckUploadDialog(uploadsDialog);
                    }
                }
            });
        }
    });
}

function uncheckReuseSettingsDialog(dialog) {
    let label = dialog.querySelector('.label');
    let targetText = "タイトル"; // TODO パラメータにする
    if (label != null && label.outerText != targetText) {
        return;
    }
    let checkbox = dialog.querySelector('ytcp-checkbox-lit');
    if (checkbox != null && checkbox.hasAttribute('checked')) {
        // Create a new 'click' event
        var event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        // Dispatch the event
        checkbox.dispatchEvent(event);
    }
}
// すべてを表示を押す必要がある
// "notify-subscribers"
function uncheckUploadDialog(dialog) {
    var click = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    // すべて表示にクリックイベントを発行
    let toggleButton = dialog.querySelector('#toggle-button');
    if (toggleButton == null) {
        return;
    }
    toggleButton.dispatchEvent(click);
    // Create a MutationObserver instance to wait for the #notify-subscribers element
    let observer = new MutationObserver((mutations, observer) => {
        let targetCheck = dialog.querySelector("#notify-subscribers");
        if (targetCheck != null && targetCheck.hasAttribute("checked")) {
            click = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            targetCheck.dispatchEvent(click);

            // Once the element is found and the action is performed, stop observing
            observer.disconnect();
        }
    });

    // Start observing
    observer.observe(dialog, { childList: true, subtree: true });

}

let observer = new MutationObserver(handleMutation);
observer.observe(document, { childList: true, subtree: true });
