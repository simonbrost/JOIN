function tempRenderAddTask() {
    return `<div class="addTaskContent">
    <h1>Add Task</h1>
    <div class="form">
        <div class="formLeftSide">
            <div class="firstBlock">
                <span data-end="*">Title</span>
                <input autocomplete="off" type="text" name="" id="addTaskInputTitle" placeholder="Enter a title">
                <div id="addTaskInputTitleRequired" class="requiredFieldText">This field is required</div>
            </div>
            <div class="secondBlock">
                <span data-end="*">Description</span>
                <textarea id="addTaskTextArea" placeholder="Enter a Description"></textarea>
                <div id="addTaskTextAreaRequired" class="requiredFieldText">This field is required</div>
            </div>
            <div class="thirdBlock">
                <span>Assigned to</span>
                <div class="dropDownWithInput">
                    <div class="assignedTo">
                        <input type="text" onclick="openContactDropDown()" placeholder="Select contacts to assign" id="assignedToInput" onkeyup="searchContactInDropDown()">
                        <div class="dropDownArrow" onclick="toggleDropDown()">
                            <img id="dropDownImage" src="./img/arrow_drop_down_down.svg" alt="">
                        </div>
                    </div>
                    <div id="imageFromDropDown"></div>
                    <div id="dropDownContact">
                    </div>
                </div>
            </div>
            <div class="bottomText" data-start="*">This field is required</div>
        </div>
        <div class="formSeparator"></div>
        <div class="formRightSide">
            <div class="dateBlock">
                <span data-end="*">Due Date</span>
                <input type="date" id="addTaskDate" value="${todaysDate}" min=${new Date().toISOString().split("T")[0]} max="2099-01-01">
                <span class="requiredFieldText">This field is required</span>
            </div>
            <div class="prioBlock">
                <span>Prio</span>
                <div class="prio">
                    <div id="editPrioUrgent" onclick="changePrioColor(this, '#FF3D00'); getPrio(this)">Urgent<img src="./img/prioUp.svg" alt=""></div>
                    <div id="editPrioMediun" onclick="changePrioColor(this, '#FFA800'); getPrio(this)">Medium<img src="./img/prioMid.svg" alt=""></div>
                    <div id="editPrioLow" onclick="changePrioColor(this, '#7AE229'); getPrio(this)">Low<img src="./img/prioLow.svg" alt=""></div>
                </div>
            </div>
            <div class="categoryBlock">
                <span data-end="*">Category</span>
                <div class="categoryBlockDropDown">
                    <div class="selectTaskCategory" id="selectTaskCategory" onclick="openCategoryDropDown()">
                        <span id="selectTaskCategorySpan">Select task category</span>
                        <div class="dropDownArrow mgTop0">
                            <img id="dropDownImageCategory" src="./img/arrow_drop_down_down.svg" alt="">
                        </div>
                    </div>
                    <div id="selectTaskCategoryRequired" class="requiredFieldText">This field is required</div>
                    <div class="categoryDropDown" id="categoryDropDown">
                        <div class="categorysInDropDown">
                            <div onclick="getCategory('Technical Task')">Technical Task</div>
                            <div onclick="getCategory('User Story')">User Story</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="subtasksBlock">
                <span>Subtasks</span>
                <div class="taskSubtasksContainer" id="taskSubtasksContainer">
                    <input autocomplete="off" onclick="createSubTask()" type="text" name="" id="taskSubtasksInput" class="taskSubtasks" placeholder="Add new subtask">
                    <div id="subtaskIcons">
                        ${tempRenderSubtaskAddButton()}
                    </div>
                </div>
                <div class="newSubtaskAdded" id="newSubtaskAddedList"></div>
            </div>
            <div class="clearAndCreateButton">
                <div onclick="clearAddTask()" class="buttonUnfilled addTaskClearButton">Clear<img src="./img/del.svg" alt=""></div>
                <div onclick="createTask()" class="buttonFilled addTaskCreateButton">Create Task<img src="./img/check-white.svg" alt=""></div>
            </div>
        </div>
    </div>
</div>`;
}

function tempRenderCreateSubtask() {
    return `<div class="deleteAndCheck">
                <div onclick="deleteTaskInInput()">
                    <img class="delNCheckHover" style="margin-right: 4px" src="./img/del.svg" alt="">
                </div>
                <div>
                    <img style="height: 24px" src="./img/borderdash.svg" alt="">
                </div>
                <div onclick="addSubtaskToList()">
                    <img class="delNCheckHover" style="margin-left: 4px" src="./img/check.svg" alt="">
                </div>
            </div>`;
}

function tempRenderSubtaskList(i) {
    return `<div class="liContainer liContainerHover" ondblclick="editSubtasks(${i})"><li class="subtaskLi" id="li${i}">${subtasksList[i]["name"]}</li><div>
                <div class="deleteAndCheck dNoneDnC" id="editDeleteContainer${i}">
                <div onclick="editSubtasks(${i})">
                    <img class="delNCheckHover" style="margin-right: 4px" src="./img/edit.svg" alt="">
                </div>
                <div>
                    <img style="height: 24px" src="./img/borderdash.svg" alt="">
                </div>
                <div onclick="deleteSubtask(${i})">
                    <img class="delNCheckHover" style="margin-left: 4px" src="./img/delete.svg" alt="">
                </div>
            </div>`;
}

function tempRenderEditDeleteContainer(position) {
    return `<div onclick="deleteSubtask(${position})">
                <img class="delNCheckHover" style="margin-right: 4px" src="./img/delete.svg" alt="">
            </div>
            <div>
                <img style="height: 24px" src="./img/borderdash.svg" alt="">
            </div>
            <div onclick="confirmEditSubtask(${position})">
                <img class="delNCheckHover" style="margin-left: 4px" src="./img/check.svg" alt="">
            </div>`;
}

function tempRenderSubtaskAddButton() {
    return `<div onclick="createSubTask(); focusSubtasksInput()" class="addSubTaskBackground" id="dropDownArrow">
                <img class="addImg" src="./img/addIconBlue.svg" alt="">
            </div>`;
}

function tempRenderOpenContactDropDownSection() {
    return `<div class="dropDownSection" id="dropDownSection"></div>`;
}

function tempRenderDopwDownContacts(i) {
    return `<div class="contactsInMenu" id="contactsInMenu${i}" onclick="selectContactInDropDown(${i})">
                <div class="imgAndName">
                    <div class="contactsInMenuimg" id="contactInListImg${i}">
                        ${getInitials(i)}
                    </div>
                    <p>${contactsJson[i].fullName}</p>
                </div>
                <img src="./img/checkboxEmpty.svg" alt="checkbox">
            </div>`;
}

function tempRenderAssignedToImages(i, imgColor) {
    return `<div class="contactsInMenuimg marginRight8px" style="background-color: ${imgColor}">${getInitialsTaskSection(i)}</div>`;
}