
const drone = new ScaleDrone('LiawGxtOEqyWS4Pb', {
    data: { // Will be sent out as clientData via events
        name: getName(),
        color: getRandomColor(),
    },
});


const DOM = {
    membersCount: document.querySelector('.members-count'),
    membersList: document.querySelector('.members-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form__input'),
    form: document.querySelector('.message-form'),
};

let members = [];

drone.on('open', error => {
    if (error) {
        return console.error(error);
    }

const room = drone.subscribe('observable-room');

room.on('open', error => {
    if (error) {
        return console.error(error);
    }
});

room.on('members', m => {
    members = m;
updateMembersDOM();
});

room.on('member_join', member => {
    members.push(member);
updateMembersDOM();
});

    room.on('member_leave', ({id}) => {
        const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
    });

    room.on('data', (text, member) => {
        if (member) {
            addMessageToListDOM(text, member);
        } else {
            // Message is from server
        }
    });
});

drone.on('close', event => {
    console.log('Connection was closed', event);
});

drone.on('error', error => {
    console.error(error);
});

function getName() {
    const username = prompt("Please enter your displayname");
    document.getElementById('username').innerHTML = "You're logged in as: " + username;
    return (
      username
    );
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
    const value = DOM.input.value;
    if (value === '') {
        return;
    }
    DOM.input.value = '';
    drone.publish({
        room: 'observable-room',
        message: value,
    });
}

//------------- DOM STUFF



function createMemberElement(member) {
    const { name, color } = member.clientData;
    const el = document.createElement('div');
    el.appendChild(document.createTextNode(name));
    el.className = 'member';
    el.style.color = color;
    return el;
}

function updateMembersDOM() {
    DOM.membersCount.innerText = `${members.length} users in room:`;
    DOM.membersList.innerHTML = '';
    members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
);
}

function createMessageElement(text, member) {
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message';
    return el;
}

function addMessageToListDOM(text, member) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if (wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }
}

var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function() {
    dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
});