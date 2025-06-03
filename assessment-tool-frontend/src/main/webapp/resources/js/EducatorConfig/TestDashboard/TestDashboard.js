document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    initializePagination();
	
});

function initializeDashboard() {
    setupFilterDropdowns();
    setupSearchFunctionality();
    setupDeleteHandlers();
}




// In setupEventListeners function:
function setupEventListeners() {
    // New test button
    const newTestBtn = document.querySelector('.btn-success');
    if (newTestBtn) {
        newTestBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear any existing session data by forcing a fresh load
            window.location.href = "/EducatorConfig/TestConfiguration/BasicSettings?clearSession=true";
        });
    }

    // Keep existing card click handlers
    document.querySelectorAll('.test-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown') && !e.target.closest('.delete-assessment')) {
                const assessmentId = this.getAttribute('data-assessment-id');
                window.location.href = "/EducatorConfig/TestConfiguration/BasicSettings?assessmentId=" + assessmentId;
            }
        });
    });
}

function setupFilterDropdowns() {
    setupDropdown('sort-dropdown', sortAndFilterTestCards);
    setupDropdown('status-dropdown', sortAndFilterTestCards);
}

function setupDropdown(dropdownId, callback) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
    const parentSection = dropdown.closest('.filter-section');
    const valueDisplay = parentSection.querySelector('.filter-value');
    
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update UI
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            valueDisplay.textContent = text;
            dropdownItems.forEach(function(di) {
                di.classList.remove('active');
            });
            this.classList.add('active');

            if (typeof callback === 'function') {
                callback();
            }
        });
    });
}

function sortAndFilterTestCards() {
    const selectedSort = document.querySelector('#sort-dropdown .active') ?
        document.querySelector('#sort-dropdown .active').getAttribute('data-value') : 'newest';
    const selectedStatus = document.querySelector('#status-dropdown .active') ?
        document.querySelector('#status-dropdown .active').getAttribute('data-value') : 'all';
    const searchTerm = document.getElementById('search-input') ?
        document.getElementById('search-input').value.toLowerCase() : '';

    // Get all card containers and convert to array for sorting
    const cardContainers = Array.from(document.querySelectorAll('.test-card-container'));
    
    // Filter first
    const filteredCards = cardContainers.filter(function(cardContainer) {
        const category = cardContainer.getAttribute('data-category');
        const status = cardContainer.getAttribute('data-status');
        const title = cardContainer.querySelector('.test-title') ?
            cardContainer.querySelector('.test-title').textContent.toLowerCase() : '';
        const description = cardContainer.querySelector('.test-description') ?
            cardContainer.querySelector('.test-description').textContent.toLowerCase() : '';

        const matchesStatus = selectedStatus === 'all' || (status && status.includes(selectedStatus));
        const matchesSearch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm);

        return matchesStatus && matchesSearch;
    });

    // Then sort
    filteredCards.sort(function(a, b) {
        switch(selectedSort) {
            case 'oldest':
                return new Date(a.getAttribute('data-created')) - new Date(b.getAttribute('data-created'));
            case 'title-asc':
                return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
            case 'title-desc':
                return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
            case 'newest':
            default:
                return new Date(b.getAttribute('data-created')) - new Date(a.getAttribute('data-created'));
        }
    });

    // Hide all cards first
    cardContainers.forEach(function(card) {
        card.style.display = 'none';
    });

    // Show filtered and sorted cards
    filteredCards.forEach(function(card) {
        card.style.display = '';
    });

    updateNoAssessmentsMessage();
    updatePagination(filteredCards.length);
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.querySelector('.search-clear');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (clearBtn) {
                clearBtn.classList.toggle('d-none', searchTerm.length === 0);
            }
            sortAndFilterTestCards();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                this.classList.add('d-none');
                sortAndFilterTestCards();
            }
        });
    }
}

function updateNoAssessmentsMessage() {
    const container = document.getElementById('test-cards-container');
    if (!container) return;

    const visibleCards = container.querySelectorAll('.test-card-container[style=""]');
    const noAssessmentsMsg = container.querySelector('.no-assessments-message');
    const testCountSpan = document.getElementById('testCountSpan');

    // Update test count
    if (testCountSpan) {
        const totalCount = container.querySelectorAll('.test-card-container').length;
        const visibleCount = visibleCards.length;
        testCountSpan.textContent = `(${visibleCount} of ${totalCount})`;
    }

    if (visibleCards.length === 0) {
        if (!noAssessmentsMsg) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'col-12 text-center text-muted no-assessments-message';
            msgDiv.textContent = 'No assessments match your criteria.';
            container.appendChild(msgDiv);
        }
    } else if (noAssessmentsMsg) {
        noAssessmentsMsg.remove();
    }
}

function setupDeleteHandlers() {
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-assessment');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const assessmentId = deleteBtn.getAttribute('data-assessment-id');
            const assessmentTitle = deleteBtn.closest('.test-card') ?
                deleteBtn.closest('.test-card').querySelector('.test-title').textContent : 'this assessment';

            if (confirm('Are you sure you want to delete "' + assessmentTitle + '"?')) {
                fetch('/EducatorConfig/api/assessments/' + assessmentId, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.success) {
                        deleteBtn.closest('.col-lg-6').remove();
                        updateNoAssessmentsMessage();
                        // Update test count
                        const countSpan = document.getElementById('testCountSpan');
                        if (countSpan) {
                            const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
                            countSpan.textContent = '(' + (currentCount - 1) + ')';
                        }
                    } else {
                        alert('Failed to delete assessment: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(function(error) {
                    console.error('Error:', error);
                    alert('Failed to delete assessment');
                });
            }
        }
    });
}

// Pagination functionality
let currentPage = 1;
const cardsPerPage = 6;

function initializePagination() {
    const totalCards = document.querySelectorAll('.test-card-container').length;
    updatePagination(totalCards);
    showPage(1);
}

function updatePagination(totalCards) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const pageCount = Math.ceil(totalCards / cardsPerPage);
    pagination.innerHTML = '';

    if (pageCount <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
    prevLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(i);
        });
        pagination.appendChild(pageLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (currentPage === pageCount ? ' disabled' : '');
    nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
    nextLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < pageCount) {
            showPage(currentPage + 1);
        }
    });
    pagination.appendChild(nextLi);
}

function showPage(pageNumber) {
    currentPage = pageNumber;
    const allCards = Array.from(document.querySelectorAll('.test-card-container[style=""]'));
    const startIndex = (pageNumber - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    allCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Update pagination UI
    const paginationItems = document.querySelectorAll('#pagination .page-item');
    paginationItems.forEach((item, index) => {
        if (index === 0) { // Previous button
            item.classList.toggle('disabled', pageNumber === 1);
        } else if (index === paginationItems.length - 1) { // Next button
            item.classList.toggle('disabled', pageNumber === Math.ceil(allCards.length / cardsPerPage));
        } else { // Page numbers
            item.classList.toggle('active', index === pageNumber);
        }
    });
}