const dynamicStyle = document.getElementById('room-group-dynamic-style');
const toggleDiv = document.getElementById('room-group-toggles');
const checkboxes = [];

const updateDynamicStyle = () => {
    let cssRules = '';

    checkboxes.forEach(checkbox => {
    const labelText = checkbox.parentElement.textContent.trim();
    const className = `.${labelText}`;

    if (!checkbox.checked) {
        cssRules += `${className} { display: none; }\n`;
    }
    });

    dynamicStyle.textContent = cssRules;
};

const createCheckBox = (name, enabled) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = enabled;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    toggleDiv.appendChild(label);
    checkbox.addEventListener('change', updateDynamicStyle);
    return checkbox;
}

checkboxes.push(createCheckBox("VANILLA", false));
checkboxes.push(createCheckBox("STUBS", false));
checkboxes.push(createCheckBox("V4_0", false));
checkboxes.push(createCheckBox("V4_4", true));
toggleDiv.appendChild(document.createTextNode('-'));
checkboxes.push(createCheckBox("RegularPalace", true));
checkboxes.push(createCheckBox("GreatPalace", true));

updateDynamicStyle();
