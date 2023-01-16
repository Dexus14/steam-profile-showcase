const resultBox = document.getElementById('resultBox');
const steamIdInput = document.getElementById('steamId');
const exampleImage = document.getElementById('exampleImage');

const resultTypeLinkButton = document.getElementById('resultTypeLink');
const resultTypeHtmlButton = document.getElementById('resultTypeHtml');
const resultTypeMarkdownButton = document.getElementById('resultTypeMarkdown');

const copyButton = document.getElementById('copyButton');

resultTypeLinkButton.addEventListener('click', () => changeResultType('link'));
resultTypeHtmlButton.addEventListener('click', () => changeResultType('html'));
resultTypeMarkdownButton.addEventListener('click', () => changeResultType('markdown'));

let resultType = 'link';

copyButton.addEventListener('click', () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultBox.innerText);
        copyButton.classList.remove('btn-primary');
        copyButton.classList.add('btn-success');
        copyButton.innerText = 'Copied!';
        setTimeout(() => {
            copyButton.classList.remove('btn-success');
            copyButton.classList.add('btn-primary');
            copyButton.innerText = 'Copy';
        }, 3000);
    } else {
        copyButton.classList.remove('btn-primary');
        copyButton.classList.add('btn-danger');
        copyButton.innerText = 'Error!';
        setTimeout(() => {
            copyButton.classList.remove('btn-danger');
            copyButton.classList.add('btn-primary');
            copyButton.innerText = 'Copy';
        }, 3000);
    }
});

function getLink() {
    const steamId = steamIdInput.value;

    const regex = new RegExp(/^[0-9]{17}$/);

    if (!steamId || !regex.test(steamId)) {
        return null;
    }

    return window.origin + '/api/templates/regular?steamid=' + steamId;
}

function changeResultType(type) {
    resultType = type;

    resultTypeHtmlButton.classList.remove('active');
    resultTypeLinkButton.classList.remove('active');
    resultTypeMarkdownButton.classList.remove('active');

    switch (type) {
        case 'link':
            resultTypeLinkButton.classList.add('active');
            break;
        case 'html':
            resultTypeHtmlButton.classList.add('active');
            break;
        case 'markdown':
            resultTypeMarkdownButton.classList.add('active');
            break;
    }

    updateResultBox();
}

function updateResultBox() {
    const resultLink = getLink();

    if (resultLink === null) {
        exampleImage.src = './preview.png';
        resultBox.innerText = 'Invalid SteamID';
        return;
    }

    exampleImage.src = resultLink;

    switch (resultType) {
        case 'link':
            resultBox.innerText = resultLink;
            break;
        case 'html':
            resultBox.innerText = `<a href="${window.origin}"><img src="${resultLink}"  alt="steam-profile-showcase"/></a>`;
            break;
        case 'markdown':
            resultBox.innerText = `[![steam-profile-showcase](${resultLink})](${window.origin})`;
            break;
    }
}

steamIdInput.addEventListener('input', updateResultBox);
