var currentPage = 1;
var studentsPerPage = 10;
var pageClass  = document.querySelector('.page');
var studentsArray = document.querySelectorAll('ul.student-list li');

// Add remove function for IE
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// Display just the requerd students by array
var displayStudentsByArray = function(array) {
    var animation = 'fadeIn';

    // Hide all students.
    for (var i = 0; i < array.length; i++) {
        // Remove animation and hide
        if (array[i].classList.contains(animation)) {
            array[i].classList.remove(animation);
            array[i].style.display = 'none';
        } else {
            array[i].style.display = 'none';
        }
    }
    // Display the students by array
    for (i = (currentPage - 1) * studentsPerPage; i < currentPage * studentsPerPage; i++) {
        // Prevent style for undifind elements
        if (i < array.length) {
            array[i].style.display = 'block';
            // Add animation
            if (!array[i].classList.contains('animated')) {
                array[i].classList.add('animated');
            }
            array[i].classList.add(animation);
        }
    }
    updatePagination(array);
};

// Calculate numbers of pages
var getPages = function(array) {
    var pages = 0;
    for (var i = 1; i < array.length; i += studentsPerPage) {
        pages++;
    }
    return pages;
};

// Create search box
var createSearch = function() {
    var header  = document.querySelector('.page-header');
    var div     = document.createElement('div');
    var input   = document.createElement('input');
    var button  = document.createElement('button');

    div.className = 'student-search';
    input.placeholder = 'Search for students...';
    button.innerText = 'Clear';

    // Clear the input and display all students
    button.onclick = function() {
            input.value = '';
            displayStudentsByArray(studentsArray);
            removeErrorMessage();
            input.focus();
    };
    // Search students while typing
    input.onkeyup = function() {
        var lowerInput = input.value.toLowerCase(); 
        var studentDetails = document.querySelectorAll('ul.student-list .student-details');
        var studentsToShow = [];

        for (var i = 0; i < studentDetails.length; i++) {
            studentDetails[i].parentNode.style.display = 'none';
            // If input value is index of student name or student email show the student
            if (studentDetails[i].getElementsByTagName('h3')[0].innerText.indexOf(lowerInput) > -1 || studentDetails[i].getElementsByClassName('email')[0].innerText.indexOf(lowerInput) > -1) {
                studentsToShow.push(studentDetails[i].parentNode);
            }
        }
        if(studentsToShow.length > 0) {
            // If studentsToShow update currentPage and removeErrorMessage
            currentPage = 1;
            removeErrorMessage();
        } else {
            // Else display error message
            createErrorMessage();
        }
        // Display the students
        displayStudentsByArray(studentsToShow);
    };

    div.appendChild(input);
    div.appendChild(button);
    header.appendChild(div);
};

// Create pagination and append to .page
var createPagination = function(array) {
    var div   = document.createElement('div');
    var ul    = document.createElement('ul');
    var li;
    var a;

    for (var i = 1; i < getPages(array) + 1; i++) {
        li = document.createElement('li');
        a = document.createElement('a');

        if (i === currentPage) {
            a.className = 'active';
        }
        // updatePage onclick
        a.addEventListener('click', updatePage(array));
        // preventDefault onclick
        a.addEventListener('click', preventDefault, false);
        a.innerText = i;
        a.setAttribute('href', '#');
        li.appendChild(a);
        ul.appendChild(li);
    }
    div.className = 'pagination';

    // Append only if there is more then 1 pgae
    if(getPages(array) > 1) {
        div.appendChild(ul);
        pageClass.appendChild(div);
    }
};

// preventDefault
var preventDefault = function(event) {
    event.preventDefault();
};

// Update currentPage and displayStudentsByArray
var updatePage = function(array) {
    return function() {
        var active = document.querySelector('.pagination a.active');
        if (this.className !== 'active') {
            this.className = 'active';
            active.className = '';
        }
        // Update currentPage
        currentPage = parseInt(this.innerText);
        // Update displayStudentsByArray
        displayStudentsByArray(array);
    };
};

// Remove current pagination and create a new one base on list
var updatePagination = function(array) {
    var currentPagination = document.querySelector('.pagination');
    if (currentPagination) {
        currentPagination.remove();
    }
    createPagination(array);
};

// Create 'No Result' error message
var createErrorMessage = function() {
    var error = document.querySelector('.search-error');
    var div = document.createElement('div');
    var h2 = document.createElement('h2');
    var p = document.createElement('p');

    div.className = 'search-error';
    h2.innerText = 'No Results';
    p.innerText = 'No results are found. Plese search again, or press the \'Clear\' button to get a list of all the students';

    div.appendChild(h2);
    div.appendChild(p);
    if (!error) {
        pageClass.appendChild(div);
    }
};

// Remove 'No Result' error message
var removeErrorMessage = function() {
    var error = document.querySelector('.search-error');
    if(error) {
        error.remove();
    }
};

displayStudentsByArray(studentsArray);
createSearch();