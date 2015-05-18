var ajaxRequester = (function () {
    var makeRequest = function makeRequest(method, url, data, success, error) {
        return $.ajax({
            headers: {
                'X-Parse-Application-Id': 'Mv248r8bnylYI52LQEv3oyBXUNJCQJGlGsmvtEGA',
                'X-Parse-REST-API-Key': 'qrltHp4aereH1QyuEjNaWJYHwbfqkg1OHkwBDlS7'
            },
            contentType: 'application/json',
            method: method,
            url: url,
            data: JSON.stringify(data),
            success: success,
            error: error
        })
    };

    function getRequest(url, success, error) {
        return makeRequest('GET', url, null, success, error);
    }

    function postRequest(url, data, success, error) {
        return makeRequest('POST', url, data, success, error);
    }

    function putRequest(url, data, success, error) {
        return makeRequest('PUT', url, data, success, error);
    }

    function deleteRequest(url, success, error) {
        return makeRequest('DELETE', url, {}, success, error);
    }

    return {
        get: getRequest,
        post: postRequest,
        put: putRequest,
        delete: deleteRequest
    }
}());

var url = 'https://api.parse.com/1/classes/Book/';

ajaxRequester.get(url + '?order=title', success, error);

function success(data) {
    if ('title' in data){
        addBookToDom(data);
    } else if ('objectId' in data){
        ajaxRequester.get(url + data.objectId, success, error);
    } else if ('results' in data){
        data.results.forEach(function(book){
            addBookToDom(book);
        });
    } else {
        console.log(data);
    }
}

function error(err){
    console.log(err.responseText);
}

function addBookToDom(book){
    var imageUrl = book.image;
    if (!imageUrl) {
        imageUrl = 'http://i.imgur.com/gHdHsEV.jpg';
    }
    $('<option>').val(book.objectId).text(book.title).appendTo('#selectedBook');
    var div = $('<div>').addClass('singleBookContainer').attr('id', book.objectId);
    $('<img>').addClass('cover').attr('src', imageUrl).appendTo(div);
    $('<span>').addClass('title').text(book.title).appendTo(div);
    $('<span>').addClass('author').text('Author: ' + book.author).appendTo(div);
    $('<span>').addClass('isbn').text('ISBN:' + book.isbn).appendTo(div);
    div.appendTo('#booksContainer');
}

$('#add').click(addBook);
$('#edit').click(editBook);
$('#delete').click(deleteBook);

function addBook(){
    var title = $('#title').val();
    var author = $('#author').val();
    var isbn = $('#isbn').val();
    var cover = $('#cover').val();
    var data = {title: title, author: author, isbn: isbn, image: cover};
    ajaxRequester.post(url, data, success, error);
    $('#title').val('');
    $('#author').val('');
    $('#isbn').val('');
    $('#cover').val('');
}

function editBook(){
    var bookId = $('#selectedBook').val();
    if (bookId == 'none'){
        return;
    }
    var title = $('#title').val();
    var author = $('#author').val();
    var isbn = $('#isbn').val();
    var cover = $('#cover').val();
    var data = {};
    if (title) {
        data.title = title;
        $('#' + bookId).find('span.title').text(title);
        $('option[value=' + bookId + ']').text(title);
    }
    if (author) {
        data.author = author;
        $('#' + bookId).find('span.author').text(author);
    }
    if (isbn) {
        data.isbn = isbn;
        $('#' + bookId).find('span.isbn').text(isbn);
    }
    if (cover) {
        data.image = cover;
        $('#' + bookId).find('img.cover').attr('src', cover);
    }
    ajaxRequester.put(url + bookId, data, success, error);
    $('#title').val('');
    $('#author').val('');
    $('#isbn').val('');
    $('#cover').val('');
}

function deleteBook(){
    var bookId = $('#selectedBook').val();
    if (bookId == 'none'){
        return;
    }
    $('option[value=' + bookId + ']').remove();
    $('#' + bookId).remove();
    ajaxRequester.delete(url + bookId, success, error);
}