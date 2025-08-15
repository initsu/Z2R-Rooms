const dynamicStyle = document.getElementById('room-group-dynamic-style');
const toggleContainer = document.getElementById('room-group-toggles');

const STATES = ['neutral', 'plus', 'minus']; // cycle order
const SYMBOLS = {
    neutral: '•', // invisible dot
    plus: '+',
    minus: '−'
};

// Group definition: groupName => [{className, caption, defaultEnabled}]
const groups = {
  RoomGroup: [
    { className: 'VANILLA', caption: 'Vanilla', startState: 'neutral' },
    { className: 'STUBS', caption: 'Stubs', startState: 'neutral' },
    { className: 'V4_0', caption: 'v4.0', startState: 'neutral' },
    { className: 'V4_4', caption: 'v4.4', startState: 'plus' },
  ],
  Palace: [
    { className: 'RegularPalace', caption: 'Regular Palace', startState: 'neutral' },
    { className: 'GreatPalace', caption: 'Great Palace', startState: 'neutral' },
  ],
  RoomType: [
    { className: 'Entrance', caption: 'Entrance', startState: 'neutral' },
    { className: 'ItemRoom', caption: 'Item Room', startState: 'neutral' },
    { className: 'BossRoom', caption: 'Boss Room', startState: 'neutral' },
    { className: 'DropZone', caption: 'Drop Zone', startState: 'neutral' },
    { className: 'SegmentedRoom', caption: 'Segmented Room', startState: 'neutral' },
  ],
  Tag: [
    { className: 'LongDeadEnd', caption: 'Long Dead End', startState: 'neutral' },
    { className: 'WalkthroughWall', caption: 'Walkthrough Wall', startState: 'neutral' },
//    { className: 'Trivial', caption: 'Trivial', startState: 'neutral' },
    { className: 'Expert', caption: 'Expert', startState: 'neutral' },
  ],
  ExitType: [
    { className: 'DEADEND_EXIT_LEFT', caption: '⇦', startState: 'neutral' },
    { className: 'DEADEND_EXIT_RIGHT', caption: '⇨', startState: 'neutral' },
    { className: 'DEADEND_EXIT_UP', caption: '⇧', startState: 'neutral' },
    { className: 'DEADEND_EXIT_DOWN', caption: '⇩', startState: 'neutral' },
    { className: 'DROP_STUB', caption: '⇓', startState: 'neutral' },
    { className: 'HORIZONTAL_PASSTHROUGH', caption: '⇦⇨', startState: 'neutral' },
    { className: 'VERTICAL_PASSTHROUGH', caption: '⇩⇧', startState: 'neutral' },
    { className: 'DROP_ELEVATOR_UP', caption: '⇓⇧', startState: 'neutral' },
    { className: 'NW_L', caption: '⇦⇧', startState: 'neutral' },
    { className: 'NE_L', caption: '⇧⇨', startState: 'neutral' },
    { className: 'SW_L', caption: '⇦⇩', startState: 'neutral' },
    { className: 'DROP_SW_L', caption: '⇦⇓', startState: 'neutral' },
    { className: 'SE_L', caption: '⇩⇨', startState: 'neutral' },
    { className: 'DROP_SE_L', caption: '⇓⇨', startState: 'neutral' },
    { className: 'INVERSE_T', caption: '⇦⇧⇨', startState: 'neutral' },
    { className: 'LEFT_T', caption: '⇦⇩⇧', startState: 'neutral' },
    { className: 'DROP_LEFT_T', caption: '⇦⇓⇧', startState: 'neutral' },
    { className: 'RIGHT_T', caption: '⇩⇧⇨', startState: 'neutral' },
    { className: 'DROP_RIGHT_T', caption: '⇓⇧⇨', startState: 'neutral' },
    { className: 'T', caption: '⇦⇩⇨', startState: 'neutral' },
    { className: 'DROP_T', caption: '⇦⇓⇨', startState: 'neutral' },
    { className: 'FOUR_WAY', caption: '⇦⇩⇧⇨', startState: 'neutral' },
    { className: 'DROP_FOUR_WAY', caption: '⇦⇓⇧⇨', startState: 'neutral' },
  ]
};

const groupButtons = {}; // { groupName: [{className, button}] }

function createGroupUI(groupName, classItems) {
  const groupDiv = document.createElement('div');
  groupDiv.className = groupName + '-container';
  const titleSpan = document.createElement('span');
  titleSpan.textContent = groupName;
  titleSpan.className = 'group-title';
  groupDiv.appendChild(titleSpan);
  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-group';

  groupButtons[groupName] = [];

  classItems.forEach(({ className, caption, startState }) => {
    const label = document.createElement('label');
    const btn = document.createElement('div');
    btn.className = 'tri-checkbox ' + startState;
    btn.dataset.state = startState;
    btn.textContent = SYMBOLS[startState];

    btn.addEventListener('click', () => {
      const idx = STATES.indexOf(btn.dataset.state);
      const next = STATES[(idx + 1) % STATES.length];
      btn.dataset.state = next;
      btn.className = 'tri-checkbox ' + next;
      btn.textContent = SYMBOLS[next];
      updateDynamicStyle();
    });

    label.appendChild(btn);
    label.appendChild(document.createTextNode(' ' + caption));
    checkboxContainer.appendChild(label);

    groupButtons[groupName].push({ className, button: btn });
  });

  groupDiv.appendChild(checkboxContainer);
  toggleContainer.appendChild(groupDiv);
}

function updateDynamicStyle() {
  let cssRules = '';

  Object.entries(groupButtons).forEach(([groupName, items]) => {
    const plusClasses = items
      .filter(({ button }) => button.dataset.state === 'plus')
      .map(({ className }) => className);

    const minusClasses = items
      .filter(({ button }) => button.dataset.state === 'minus')
      .map(({ className }) => className);

    if (plusClasses.length > 0) {
      // Build :not(...) for all plus classes
      const notSelectors = plusClasses.map(c => `:not(.${groupName}-${c})`).join('');
      cssRules += `.room${notSelectors} { display: none; }\n`;
    }

    // Minus always hides explicitly
    minusClasses.forEach(c => {
      cssRules += `.${groupName}-${c} { display: none; }\n`;
    });
  });

  dynamicStyle.textContent = cssRules;
}

// Build all groups
Object.entries(groups).forEach(([g, clsList]) => createGroupUI(g, clsList));

updateDynamicStyle();
