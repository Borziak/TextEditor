function applyOption(commandString, secondValue) {
    document.execCommand(commandString, false, secondValue);
}

jQuery(document).ready(function ($) {
    let editor = $('#editor_container');
    $(editor).dblclick(function (event) {
        let selection = window.getSelection();
        let newRange = selection.getRangeAt(0);
        let requestString = 'https://api.datamuse.com/words?ml=' + newRange.toString()+'&max=10';
        let request = generateRequest(requestString, 'GET');
        fetch(request).then(function (responce) {
            return responce.json();
        }).then(function (receivedJson) {
            displayWords(receivedJson, event)
        });
    });

    function displayWords(receivedJson, event) {
        $('.synonyms-feed').empty();
        receivedJson.forEach(function (word) {
            let synonym = word.word;
            $('.synonyms-feed').append('<button class="synonym" onclick="applyOption(\'insertText\', \''+synonym+'\')">'+synonym+'</button>');
        });
        if (receivedJson.length <= 0) {
            $('.synonyms-feed').append('<div class="synonym">No similar words</div>');
        }
        $('.synonyms').css('display', 'block');
        $('.synonyms').animate({top: (event.clientY - 15) + 'px', left: (event.clientX + 40) + 'px'}, {easing: 'easeOutBounce', duration: 1000});
    }

    $('.synonyms i').on('click', function () {
        $('.synonyms-feed').empty();
        $('.synonyms').animate({left: '-200px'}, {easing: 'easeOutBounce', duration: 1000});
    });

    function generateRequest(url, method) {
        let init = {
            method: method
        };
        return new Request(url, init);
    }
});