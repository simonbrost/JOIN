let selectedElement = false;
let summaryNumbersUpdated = false;
let searchValue = "";
let selectedContacts = [];
let subtasksList = [];
let prioLabel = "";
const todaysDate = new Date().toJSON().slice(0, 10);
let allTasks = [];
let taskStatus = 'todo';

/**
 * This function renders the 'Add task' page.
 * 
 * @param {string} taskStatusFromResponsive - Taskname Variable to render in the right Section
 */
function renderAddTask(taskStatusFromResponsive) {
    let content = document.getElementById('content');
    selectedContacts = [];
    content.innerHTML = `<div class="addTaskContainer">${tempRenderAddTask()}</div>`;
    setActiveNavItem("addTask");
    taskStatus = taskStatusFromResponsive;
}

/**
 * This function loads all tasks from remote storage.
 */
async function loadTasksFromStorage() {
    let storageParseTasks = await getItem('tasks');
    allTasks = JSON.parse(storageParseTasks.data.value);
    if (!summaryNumbersUpdated) {
        updateSummaryNumbers();
        summaryNumbersUpdated = true;
    }
}

/**
 * This function loads all tasks into the storage.
 */
function setTasksStorage() {
    let allTasksAsString = JSON.stringify(allTasks);
    setItem('tasks', allTasksAsString);
}

/**
 * This function creates a Task and verifies the mandatory fields.
 */
function createTask() {
    const elements = {
        title: document.getElementById('addTaskInputTitle'),
        description: document.getElementById('addTaskTextArea'),
        date: document.getElementById('addTaskDate'),
        category: document.getElementById('selectTaskCategorySpan'),
        titleRequired: document.getElementById('addTaskInputTitleRequired'),
        descriptionRequired: document.getElementById('addTaskTextAreaRequired'),
        categoryRequired: document.getElementById('selectTaskCategoryRequired')
    };

    const isEmpty = (value) => value.trim() === '';
    const isCategoryNotSelected = elements.category.innerText === 'Select task category';

    elements.titleRequired.style.cssText = isEmpty(elements.title.value) ? 'display:block !important;' : '';
    elements.descriptionRequired.style.cssText = isEmpty(elements.description.value) ? 'display:block !important;' : '';
    elements.categoryRequired.style.cssText = isCategoryNotSelected ? 'display:block !important;' : '';

    if (!isEmpty(elements.title.value) && !isEmpty(elements.description.value) && !isCategoryNotSelected) {
        const newTask = {
            id: '',
            status: taskStatus || 'todo',
            title: elements.title.value,
            description: elements.description.value,
            assignedTo: selectedContacts,
            dueDate: elements.date.value,
            prio: prioLabel,
            category: elements.category.innerText,
            subtasks: subtasksList
        };
        allTasks.push(newTask);
        setTasksStorage();
        clearAddTask();
        renderBoard();
    }
}

/**
 * This function sets the variable 'taskStatus' to the one clicked on the board.
 * 
 * @param {string} status - Status Section from Board
 */
function setStatus(status) {
    taskStatus = status;
}

/**
 * This function clears the Add Task Form
 */
function clearAddTask() {
    prioLabel = '';
    subtasksList = [];
    selectedElement = false;
    searchValue = "";
    selectedContacts = [];
    const addTaskInputTitle = document.getElementById('addTaskInputTitle');
    const addTaskTextArea = document.getElementById('addTaskTextArea');
    const selectTaskCategory = document.getElementById('selectTaskCategory');
    addTaskInputTitle.value = '';
    addTaskTextArea.value = '';
    selectTaskCategory.children[0].innerText = 'Select task category';
    clearPrioButtons();
    renderSubtasksInTask();
    renderAssignedToImages();
}

/**
 * This function sets the Prio Buttons to default
 */
function clearPrioButtons() {
    const buttons = document.querySelectorAll('.prio div');
    buttons.forEach(button => {
        button.style.backgroundColor = '';
        button.style.boxShadow = '';
        button.style.color = '';
        button.lastChild.style.filter = '';
        button.style.fontWeight = '';
        button.style.fontSize = '';
    });
}

/**
 * This function sets the 'prioLabel' variable from the parameter.
 * 
 * @param {string} selectedPrio - Selected Priority
 */
function getPrio(selectedPrio) {
    prioLabel = selectedPrio.innerText;
}

/**
 * This function is used to get the focus of the input field.
 */
function focusSubtasksInput() {
    let taskSubtasksInput = document.getElementById('taskSubtasksInput');
    taskSubtasksInput.focus();
}

/**
 * This function sets the selected contacts under the section as images.
 */
function createSubTask() {
    let subtaskIcons = document.getElementById('subtaskIcons');
    subtaskIcons.innerHTML = tempRenderCreateSubtask();
}

/**
 * This function adds the subtasks to the list.
 */
function addSubtaskToList() {
    let taskSubtasksInput = document.getElementById('taskSubtasksInput');
    taskSubtasksInput.focus();
    if (taskSubtasksInput.value.trim() !== "") {
        subtasksList.push({ name: taskSubtasksInput.value, done: false });
        renderSubtasksInTask();
        let subtaskIcons = document.getElementById('subtaskIcons');
        subtaskIcons.innerHTML = tempRenderSubtaskAddButton();
        taskSubtasksInput.value = "";
        taskSubtasksInput.blur();
    }
}

/**
 * This function renders the Subtask in List
 */
function renderSubtasksInTask() {
    let subtaskList = document.getElementById('newSubtaskAddedList');
    subtaskList.innerHTML = "";
    for (let i = 0; i < subtasksList.length; i++) {
        subtaskList.innerHTML += tempRenderSubtaskList(i);
    }
}

/**
 * This function enables editing a subtask.
 * 
 * @param {int} position - Position of the li element
 */
function editSubtasks(position) {
    let li = document.getElementById(`li${position}`);
    let editDeleteContainer = document.getElementById(`editDeleteContainer${position}`);
    if (li) {
        li.parentElement.classList.remove('liContainerHover')
        li.parentElement.style.backgroundColor = 'white';
        li.parentElement.style.borderBottom = '1px solid #005DFF';
        li.style.display = "flex";
        li.style.paddingLeft = "16px !important";
        li.contentEditable = "true";
        li.outline = "none";
        li.focus();
        getCursorToEndEdittable(li)
        editDeleteContainer.classList.remove('dNoneDnC');
        editDeleteContainer.innerHTML = tempRenderEditDeleteContainer(position);
    }
}

/**
 * This function is used for edit Subtask in list
 * 
 * @param {int} position - Subtask position in list
 */
function confirmEditSubtask(position) {
    let li = document.getElementById(`li${position}`);
    subtasksList[position]['name'] = li.innerText;
    renderSubtasksInTask();
}

/**
 * This function allows to edit the li item
 * 
 * @param {int} li - Subtask position in list
 */
function getCursorToEndEdittable(li) {
    const range = document.createRange();
    range.selectNodeContents(li);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * This function delete the subtask in list without edit
 * 
 * @param {int} position - Subtask position in list
 */
function deleteSubtask(position) {
    subtasksList.splice(position, 1);
    renderSubtasksInTask();
}

/**
 * The function is on the delete icon when editing the list item.
 */
function deleteTaskInInput() {
    let subtaskIcons = document.getElementById('subtaskIcons');
    let taskSubtasksInput = document.getElementById('taskSubtasksInput');
    taskSubtasksInput.value = "";
    subtaskIcons.innerHTML = tempRenderSubtaskAddButton();
}

/**
 * This function retrieves the clicked category.
 * 
 * @param {string} category - The category's name.
 */
function getCategory(category) {
    let selectTaskCategory = document.getElementById('selectTaskCategory');
    selectTaskCategory.children[0].innerText = category;
    closeCategoryDropDown();
}

/**
 * This function opens the Category Dropdown
 */
function openCategoryDropDown() {
    let categoryDropDown = document.getElementById('categoryDropDown');
    let dropDownImageCategory = document.getElementById('dropDownImageCategory');
    let selectTaskCategory = document.getElementById('selectTaskCategory');
    if (dropDownImageCategory.src.includes('down_down')) {
        dropDownImageCategory.src = './img/arrow_drop_down_up.svg';
        categoryDropDown.style.display = 'block';
        selectTaskCategory.style.border = '1px solid #29ABE2';
    } else {
        closeCategoryDropDown()
    }
}

/**
 * This function closes the Dropdown 
 */
function closeCategoryDropDown() {
    let categoryDropDown = document.getElementById('categoryDropDown');
    let dropDownImageCategory = document.getElementById('dropDownImageCategory');
    let selectTaskCategory = document.getElementById('selectTaskCategory');
    dropDownImageCategory.src = './img/arrow_drop_down_down.svg';
    categoryDropDown.style.display = 'none';
    selectTaskCategory.style.border = '';
}

/**
 * Added eventListener to close dropdown if u click out of the div
 */
document.addEventListener('click', function (event) {
    const thirdBlock = document.querySelector('.dropDownWithInput');
    const categoryBlockDropDown = document.querySelector('.categoryBlockDropDown');
    if (thirdBlock && !thirdBlock.contains(event.target)) {
        closeDropDown();
    }
    if (categoryBlockDropDown && !categoryBlockDropDown.contains(event.target)) {
        closeCategoryDropDown();
    }
});

/**
 * This function allows to toggle the Dropdown
 */
function toggleDropDown() {
    let dropDownImage = document.getElementById('dropDownImage');
    if (dropDownImage.src.includes('down_down')) {
        document.getElementById('assignedToInput').focus();
        openContactDropDown();
    } else {
        closeDropDown();
    }
}

/**
 * 
 * This function changes the priority buttons that are clicked and modifies their CSS.
 * 
 * @param {HTML element} element - The HTML element representing the priority button.
 * @param {hex} color - Setting the background color upon calling a function.
 */
function changePrioColor(element, color) {
    if (selectedElement === element) {
        element.style = '';
        element.lastChild.style = '';
        selectedElement = false;
    } else {
        if (selectedElement) {
            selectedElement.style = '';
            selectedElement.lastChild.style = '';
        }
        element.style.backgroundColor = color;
        element.style.boxShadow = 'none';
        element.style.color = '#ffffff';
        element.lastChild.style.filter = "brightness(0) invert(1)";
        if (window.innerWidth <= 1050) {
            element.style.fontWeight = '400';
            element.style.fontSize = '14px';
        } else {
            element.style.fontWeight = '700';
            element.style.fontSize = '21px';
        }
        selectedElement = element;
    }
}

/**
 * This function opens the contact drop down
 */
function openContactDropDown() {
    document.getElementById('assignedToInput').placeholder = "";
    let dropDownImage = document.getElementById('dropDownImage');
    let dropDownContact = document.getElementById('dropDownContact');
    if (dropDownImage.src.includes('down_down')) {
        dropDownImage.src = './img/arrow_drop_down_up.svg';
        dropDownContact.innerHTML = tempRenderOpenContactDropDownSection();
        renderDropDownContacts();
        dropDownContact.style.display = "block";
    }
}

/**
 * This function closes the contact drop down
 */
function closeDropDown() {
    dropDownImage.src = './img/arrow_drop_down_down.svg';
    dropDownContact.style.display = "none";
    searchValue = "";
    document.getElementById('assignedToInput').value = '';
    document.getElementById('assignedToInput').placeholder = "Select contacts to assign";
    renderAssignedToImages();
}

/**
 * This function displays all created contacts in the dropdown list.
 */
function renderDropDownContacts() {
    let dropDownSection = document.getElementById('dropDownSection');
    dropDownSection.innerHTML = '';
    for (let i = 0; i < contactsJson.length; i++) {
        if (contactsJson[i].fullName.toLowerCase().includes(searchValue.toLowerCase())) {
            dropDownSection.innerHTML += tempRenderDopwDownContacts(i);
            let contactsInMenu = document.getElementById(`contactsInMenu${i}`);
            if (selectedContacts.indexOf(contactsInMenu.children[0].children[1].innerHTML) > -1) {
                selectContactInDropDown(i);
            }
            setContactListImgColor(i);
        }
    }
}

/**
 * This function modifies the checkboxes and the CSS of the selected contact in the dropdown when clicked.
 * 
 * @param {int} i - The position of the contact refers to where it's located within a list or display of contacts, indicating its order relative to other contacts.  
 */
function selectContactInDropDown(i) {
    let contactsInMenu = document.getElementById(`contactsInMenu${i}`);
    let isSelected = contactsInMenu.classList.contains('selected');

    if (isSelected) {
        selectedContacts.splice(selectedContacts.indexOf(contactsInMenu.children[0].children[1].innerHTML), 1);
        contactsInMenu.children[0].children[1].style.color = '';
        contactsInMenu.style.backgroundColor = '';
        contactsInMenu.lastElementChild.src = './img/checkboxEmpty.svg';
    } else {
        if (selectedContacts.indexOf(contactsInMenu.children[0].children[1].innerHTML) == -1) {
            selectedContacts.push(contactsInMenu.children[0].children[1].innerHTML);
        }
        contactsInMenu.children[0].children[1].style.color = '#fff';
        contactsInMenu.style.backgroundColor = '#2a3647';
        contactsInMenu.lastElementChild.src = './img/checkboxCheckedWhite.svg';
    }
    contactsInMenu.classList.toggle('selected');
}

/**
 * This functin allows the Search function in dropdown contacts
 */
function searchContactInDropDown() {
    searchValue = document.getElementById('assignedToInput').value;
    renderDropDownContacts();
}

/**
 * This function renders the Images below the dropdown contact
 */
function renderAssignedToImages() {
    let imageFromDropDown = document.getElementById('imageFromDropDown');
    imageFromDropDown.innerHTML = "";
    let htmlToAdd = "";
    let numberToAdd = "";
    for (let i = 0; i < selectedContacts.length; i++) {
        let imgColor = contactColorsMap.get(selectedContacts[i]);
        if (imgColor) {
            if (i < 4) {
                htmlToAdd += tempRenderAssignedToImages(i, imgColor);
            } else {
                numberToAdd = `<div class="contactsInMenuimg marginRight8px" style="background-color: grey">+${i - 3}</div>`;
            }
        }
    }
    htmlToAdd += numberToAdd;
    imageFromDropDown.innerHTML += htmlToAdd;
}

/**
 * This function get the first char of first name and last name
 * 
 * @param {int} i - contact position in selected Contacts
 * @returns - initials of contacts name
 */
function getInitialsTaskSection(i) {
    if (selectedContacts[i].split(' ').length > 1) {
        return selectedContacts[i].split(' ')[0].charAt(0).toUpperCase() + selectedContacts[i].split(' ')[1].charAt(0).toUpperCase();
    } else {
        return selectedContacts[i].split(' ')[0].charAt(0).toUpperCase();
    }
}