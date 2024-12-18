<template>
  <div class="editor">
    <div id="toolbar">
      <span class="ql-formats dashboard-editor-formats">
        <select class="ql-header dashboard-editor-header ql-btn">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option></option>
        </select>
      </span>
      <span class="ql-formats dashboard-editor-formats">
        <button
          v-tooltip.bottom="{
            value: 'Bold',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-bold dashboard-editor-bold ql-btn"
        ></button>
        <button
          v-tooltip.bottom="{
            value: 'Italic',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-italic dashboard-editor-italic ql-btn"
        ></button>
        <button
          v-tooltip.bottom="{
            value: 'Underline',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-underline dashboard-editor-underline ql-btn"
        ></button>
      </span>

      <span class="ql-formats dashboard-editor-formats">
        <select class="ql-color dashboard-editor-color ql-btn">
          <option
            v-for="item in colorsText"
            :key="item.name"
            :value="item.value.toLowerCase()"
          ></option>
        </select>
        <div class="picker"></div>
        <select class="ql-background dashboard-editor-background ql-btn">
          <option
            v-for="item in colorsBack"
            :key="item.name"
            :value="item.value.toLowerCase()"
          ></option>
        </select>
      </span>

      <span class="ql-formats dashboard-editor-formats">
        <button
          v-tooltip.bottom="{
            value: 'List',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-list dashboard-editor-list ql-btn"
          value="ordered"
        ></button>
        <select class="ql-align dashboard-editor-align ql-btn"></select>
      </span>

      <span class="ql-formats dashboard-editor-formats">
        <button
          v-tooltip.bottom="{
            value: 'Link',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-link dashboard-editor-link ql-btn"
        ></button>
        <button
          v-tooltip.bottom="{
            value: 'Image',
            pt: getClasses('editor').tooltip,
          }"
          class="ql-image dashboard-editor-image ql-btn"
        ></button>
      </span>
    </div>
    <div id="editor"></div>

    <resize-observer
      @notify="
        (sizes) => {
          replaceDropdown(sizes.width);
        }
      "
    />
  </div>
</template>

<script setup>
import { ref, defineModel, computed, watch, onMounted } from "vue";
import { getClasses } from "@/utils/classes";
import Pickr from "@simonwep/pickr";
import debounce from "lodash.debounce";
import "@simonwep/pickr/dist/themes/nano.min.css";
import Quill from "quill";

const description = defineModel("description");
const lengthDescription = defineModel("length");

let editor;
var pickr,
  pickerMode = "color";
const colorPicker = ref("#ffffff");
const backgroundPicker = ref("#ffffff");

const colorsText = ref([
  { name: "default", value: "#ffffff" },
  { name: "default", value: "#7b9dcf" },
  { name: "default", value: "#000000" },
  { name: "default", value: "red" },
  { name: "default", value: "green" },
  { name: "default", value: "yellow" },
  { name: "color-picker", value: "color-picker" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "default", value: "reset" },
]);

const colorsBack = ref([
  { name: "default", value: "#000000" },
  { name: "default", value: "#ffffff" },
  { name: "default", value: "#7b9dcf" },
  { name: "color-picker", value: "color-picker" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "new-color", value: "new-color" },
  { name: "default", value: "reset" },
]);

const initQuill = () => {
  const options = {
    modules: {
      toolbar: "#toolbar",
    },
    placeholder: "Enter text of post here...",
    theme: "snow",
  };

  editor = new Quill("#editor", options);

  // add default value
  const Delta = Quill.import("delta");
  if (description.value) {
    const stringToObject = JSON.parse(description.value);
    editor.setContents(new Delta(stringToObject));

    // для сохранения поста без изменения текста
    updateValue();
  }

  // реактивное обновление
  editor.on("text-change", () => {
    updateValue();
  });
};

onMounted(() => {
  initQuill();

  // length text
  updateLength();

  initPickr();
  validatePickr();

  addColor();
  addHandlers();

  initPosDropdown();

  // replaceSpaces();
});

const updateValue = () => {
  description.value = editor.getContents();
};

const handlerColor = (type, value) => {
  pickerMode = type;
  if (value === "color-picker" || value === "new-color") {
    pickr.show();
  } else if (value === "reset") {
    selectColor(type, null);
  } else {
    selectColor(type, value);
  }
};

const initPickr = () => {
  pickr = Pickr.create({
    el: ".picker",
    theme: "nano",
    default: "#000000",
    lockOpacity: true,

    autoReposition: true,

    swatches: [
      "rgba(244, 67, 54)",
      "rgba(233, 30, 99)",
      "rgba(156, 39, 176)",
      "rgba(103, 58, 183)",
      "rgba(63, 81, 181)",
      "rgba(33, 150, 243)",
      "rgba(3, 169, 244)",
    ],

    components: {
      // Main components
      preview: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,

        input: true,
        save: true,
      },
    },
  });
};

const validatePickr = () => {
  // add validation
  const patternColor =
    "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*(,\\s*1)?\\)$";
  const inputPicker = document.querySelector(".pcr-result");
  inputPicker.setAttribute("pattern", patternColor);
};

const addColor = () => {
  var firstBtnColor, currentBtnColor, lengthBtnsColor;
  var firstBtnBack, currentBtnBack, lengthBtnsBack;

  // index first item new color
  firstBtnColor = colorsText.value.findIndex(
    (item) => item.name === "new-color"
  );
  currentBtnColor = firstBtnColor;
  lengthBtnsColor = colorsText.value.filter(
    (item) => item.name === "new-color"
  ).length;

  firstBtnBack = colorsBack.value.findIndex(
    (item) => item.name === "new-color"
  );
  currentBtnBack = firstBtnBack;
  lengthBtnsBack = colorsBack.value.filter(
    (item) => item.name === "new-color"
  ).length;

  pickr.on("save", (color, instance) => {
    pickr.hide();

    if (pickerMode === "color") {
      colorPicker.value = color.toHEXA().toString().toLowerCase();
      selectColor("color", colorPicker.value);

      // check new color
      const isFound = colorsText.value.some(
        (item) => item.value === colorPicker.value
      );

      if (!isFound) {
        // select
        colorsText.value[currentBtnColor].value = colorPicker.value;

        // option
        const container = document.querySelector(
          ".dashboard-editor-color .ql-picker-options"
        );
        const item = container.childNodes[currentBtnColor];
        item.setAttribute("data-value", colorPicker.value);
        item.style.backgroundColor = colorPicker.value;

        // next btn
        currentBtnColor += 1;
        if (currentBtnColor === firstBtnColor + lengthBtnsColor) {
          currentBtnColor = firstBtnColor;
        }
      }

      // start style
      const line = document.querySelector(
        ".dashboard-editor-color .ql-color-label.ql-stroke"
      );
      const button = document.querySelector(
        ".dashboard-editor-color .ql-picker-label"
      );
      line.style.stroke = colorPicker.value;
      button.classList.add("ql-active");
    }
    if (pickerMode === "background") {
      backgroundPicker.value = color.toHEXA().toString().toLowerCase();
      selectColor("background", backgroundPicker.value);

      // check new color
      const isFound = colorsBack.value.some(
        (item) => item.value === backgroundPicker.value
      );

      if (!isFound) {
        // select
        colorsBack.value[currentBtnBack].value = backgroundPicker.value;

        // option
        const container = document.querySelector(
          ".dashboard-editor-background .ql-picker-options"
        );
        const item = container.childNodes[currentBtnBack];
        item.setAttribute("data-value", backgroundPicker.value);
        item.style.backgroundColor = backgroundPicker.value;

        // next btn
        currentBtnBack += 1;
        if (currentBtnBack === firstBtnBack + lengthBtnsBack) {
          currentBtnBack = firstBtnBack;
        }
      }

      // start style
      const line = document.querySelector(
        ".dashboard-editor-background .ql-fill.ql-color-label"
      );
      const button = document.querySelector(
        ".dashboard-editor-background .ql-picker-label"
      );
      line.style.fill = backgroundPicker.value;
      button.classList.add("ql-active");
    }
  });
};

const addHandlers = () => {
  // color / background
  var toolbar = editor.getModule("toolbar");
  toolbar.addHandler("color", (value) => handlerColor("color", value));
  toolbar.addHandler("background", (value) =>
    handlerColor("background", value)
  );
};

const replaceSpaces = () => {
  const Delta = Quill.import("delta");
  editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
    const ops = delta.ops.map((op) => ({
      insert:
        typeof op.insert === "string"
          ? op.insert.replace(/\u00A0/g, " ")
          : op.insert,
      attributes: op.attributes,
    }));
    return new Delta(ops);
  });
};

const selectColor = (type, value) => {
  editor.format(type, value);
};

watch(
  () => description.value,
  (newValue) => {
    updateLength();
  }
);

const updateLength = debounce(() => {
  lengthDescription.value = editor.getText().replace(/\s+/g, "").length;
}, 300);

// позиция dropdown для цветов при resize
const initPosDropdown = () => {
  // при первом открытии списка (без resize)
  const buttonColor = document.querySelector(
    ".dashboard-editor-color .ql-picker-label"
  );
  const buttonBack = document.querySelector(
    ".dashboard-editor-background .ql-picker-label"
  );

  buttonColor.addEventListener("click", () => {
    replaceDropdown();
  });
  buttonBack.addEventListener("click", () => {
    replaceDropdown();
  });
};
const replaceDropdown = () => {
  const buttonColor = document.querySelector(
    ".dashboard-editor-color .ql-picker-label"
  );
  const optionsColor = document.querySelector(
    ".dashboard-editor-color .ql-picker-options"
  );
  const buttonBack = document.querySelector(
    ".dashboard-editor-background .ql-picker-label"
  );
  const optionsBack = document.querySelector(
    ".dashboard-editor-background .ql-picker-options"
  );
  setPosDropdown(buttonColor, optionsColor);
  setPosDropdown(buttonBack, optionsBack);
};
const setPosDropdown = (button, options) => {
  const widthOptions = 120;
  const widthDocument = document.documentElement.clientWidth;
  if (button && options) {
    const rightBtn = button.getBoundingClientRect().right;
    const offsetLeftBtn = button.getBoundingClientRect().left;
    const widthBtn = button.getBoundingClientRect().width;
    const offsetRightBtn = widthDocument - rightBtn;
    const offsetOptions = widthOptions - widthBtn;
    const offsetCenterOptions = (widthOptions - widthBtn) / 2;

    if (offsetRightBtn <= offsetCenterOptions + 10) {
      options.style.left = "auto";
      options.style.right = 0;
    } else if (offsetLeftBtn <= offsetCenterOptions + 10) {
      options.style.left = 0;
    } else {
      options.style.left = `calc(50% - ${widthOptions / 2}px)`;
    }
  }
};
</script>

<style lang="scss" scoped>
@include Description();

.editor {
  color: var(--white);
}
</style>

<style lang="scss">
@import "quill/dist/quill.snow.css" layer(quill);

.editor {
  &.is-invalid {
    .ql-container {
      @include Invalid();
    }
  }
}

// toolbar
.ql-toolbar {
  background-color: var(--black-4);
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 0;
  border-radius: 6px;
  border-color: #3f3f46;
}

// container
.ql-container {
  height: 240px;
  background-color: var(--grey-1050);
  border-radius: 6px;
  border: 1px solid #3f3f46;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  transition: box-shadow 0.3s;
}
.ql-editor {
  order: 1;
  @include Scroll(7px, 7px, var(--grey-880), var(--grey-370));
  &.ql-blank::before {
    color: var(--placeholder-filter);
    font-style: normal;
  }
  &.ql-blank:focus::before {
    content: "";
  }
  .ql-video {
    width: 100%;
  }
}

// active / hover
.ql-snow.ql-toolbar button:not(.ql-active):hover,
.ql-snow .ql-toolbar button:not(.ql-active):hover,
.ql-snow.ql-toolbar .ql-picker-label:not(.ql-active):hover,
.ql-snow .ql-toolbar .ql-picker-label:not(.ql-active):hover,
.ql-snow.ql-toolbar .ql-picker-item:not(.ql-selected):hover,
.ql-snow .ql-toolbar .ql-picker-item:not(.ql-selected):hover {
  color: inherit;
}

// btns / svg
.ql-stroke {
  stroke: var(--placeholder-filter);
}
.ql-fill {
  fill: var(--placeholder-filter);
}
.ql-snow .ql-picker {
  color: var(--placeholder-filter);
}

// formats
.ql-formats {
  border: 1px solid var(--grey-380);
  border-radius: 5px;
  margin-right: 0;
  background-color: var(--grey-1200);
  padding: 2px;
  display: flex;
  width: min-content;
  position: relative;
}

// header
.ql-header {
  &:has(> .ql-active) {
    font-weight: 600;
    background-color: #6b99c6;
  }
}
.ql-picker-label {
  padding-left: 5px;
}

// editor
.dashboard {
  &-editor {
    &-formats {
      border: 1px solid var(--grey-380);
      border-radius: 5px;
      margin-right: 0;
      background-color: var(--grey-1200);
      padding: 2px;
      display: flex;
      width: min-content;
      position: relative;
    }
    &-color {
      &:has(> .ql-active) {
        background-color: #6b99c6;
      }
    }
    &-background {
      margin-left: 5px;
      &:has(> .ql-active) {
        background-color: #6b99c6;
      }
    }
    &-align {
      &:has(> .ql-active) {
        background-color: #6b99c6;
      }
    }
  }
}

// tooltip
.p-tooltip .editor {
  &-tooltip {
    &-text {
      background: #ffffff;
      color: #000000;
      font-weight: 500;
      padding: 2px 6px;
      font-size: 12px;
    }
  }
}
.p-tooltip.p-tooltip-bottom {
  .editor-tooltip-arrow {
    border-bottom-color: #ffffff;
  }
}
.p-tooltip.p-tooltip-top {
  .editor-tooltip-arrow {
    border-top-color: #ffffff;
  }
}

/////////////////////////
//***     QUILL     ***//
/////////////////////////
.ql-btn {
  border-radius: 5px;
  transition: background-color 0.3s;
  & + & {
    margin-left: 5px;
  }
  // ховер если у Элемента и детей нет класса
  &:hover:not(.ql-active, :has(.ql-active)) {
    background-color: var(--grey-390);
  }
  // button
  &.ql-active {
    background-color: #6b99c6;
    & .ql-stroke {
      stroke: #000;
    }
    & .ql-fill {
      fill: #000;
    }
  }
  // select
  & .ql-active {
    color: #000;
    & .ql-stroke {
      stroke: #000;
    }
  }
}
.ql-picker-label {
  transition: color 0.3s;
}
.ql-stroke,
.ql-fill {
  transition: stroke 0.3s;
}
.ql-color-label {
  transition: fill 0.3s, stroke 0.3s;
}

// open list
.ql-expanded {
  .ql-picker-label {
    border-color: transparent;
  }
  & .ql-picker-label:not(.ql-active) {
    color: var(--blue-90);
  }
  & .ql-stroke {
    stroke: var(--blue-90);
  }
  & .ql-color-label {
    fill: var(--blue-90);
  }

  // dropdown
  .ql-picker-options {
    background-color: var(--grey-1200);
  }
  &:not(.ql-icon-picker) .ql-picker-item {
    padding: 5px;
  }
  .ql-picker-options .ql-picker-item:not(.ql-selected):hover {
    background-color: var(--options-hover);
  }
}

// dropdown
.ql-picker-options {
  padding: 5px;
  border-color: #3f3f46;
  border-radius: 5px;
}
.ql-picker-item {
  border-radius: 5px;
  &.ql-selected {
    background-color: #7ca9d5;
    color: #000;
  }
  &::before {
    line-height: 1;
  }
}

// color picker
.ql-picker-item {
  &[data-value="color-picker"] {
    grid-column-start: 1;
    grid-column-end: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: var(--blue-4);
    color: #000;
    font-weight: 600;

    &:before {
      content: "Pick color...";
      font-size: 12px;
      line-height: 1;
    }
  }
  &[data-value="reset"] {
    grid-column: span 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    &:before {
      content: "No color";
      line-height: 1;
      font-size: 12px;
    }
  }
}

.ql-color-picker .ql-picker-item {
  &[data-value="color-picker"] {
    width: 100%;
    height: auto;
    border-radius: 5px;
    transition: background-color 0.3s;
    margin: 5px 0;
    padding: 8px 0;
  }
  &[data-value="reset"] {
    padding: 5px 0;
    height: auto;
    border: 1px solid var(--blue-2);
  }
}

.ql-expanded
  .ql-picker-options
  .ql-picker-item:not(.ql-selected)[data-value="color-picker"]:hover {
  border-color: inherit;
  background-color: var(--picker-hover);
  color: #000;
}

// new color
.ql-picker-item {
  &[data-value="new-color"] {
    position: relative;
    background-color: var(--grey-990);

    &::before {
      content: "+";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
    }
  }
}

// color/background  list
.ql-color-picker {
  &.ql-expanded {
    .ql-picker-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }
  }
  .ql-picker-options {
    width: 120px;
  }
}
.ql-color-picker .ql-picker-item {
  height: 15px;
  width: 100%;
  border-radius: 3px;
  border-color: var(--grey-740);
  margin: 0;
  transition: border-color 0.3s;
}
.ql-color-picker .ql-picker-item:hover {
  border-color: var(--white);
}

// align list
.ql-icon-picker .ql-picker-item {
  padding: 2px;
  .ql-stroke {
    stroke: var(--grey-100);
  }
  &.ql-selected {
    .ql-stroke {
      stroke: #000;
    }
  }
}

// tooltip
.ql-tooltip {
  position: sticky;
  width: 100%;
  order: 0;
  transform: translateY(0);
  top: 0 !important;
  margin-top: 0 !important;
  background: var(--grey-1200);
  border: 1px solid var(--blue-90);
  box-shadow: 0 0 10px var(--blue-90);
  color: var(--grey-100);
  padding: 5px 12px;
  border-radius: 5px;

  &:not(.ql-hidden) {
    display: flex;
    align-items: center;
  }

  &::before {
    color: var(--white);
  }

  input[type="text"] {
    border: 1px solid var(--grey-330);
    border-radius: 5px;
    color: var(--white);
    &::placeholder {
      color: var(--grey-340);
    }
  }

  .ql-action,
  .ql-remove {
    height: 100%;
    padding: 0 8px;
    border-radius: 5px;
    margin-left: 10px;
    box-shadow: 0 0 5px #000;
    font-size: 13px;
  }
  .ql-action {
    color: #000;
    font-weight: 600;
    background-color: var(--blue-4);
    display: flex;
    align-items: center;
    &::after {
      margin-left: 0;
      padding-right: 0;
      border-right: none;
    }
  }
  .ql-remove {
    border: 1px solid var(--blue-4);
    color: var(--white);
    &::before {
      margin-left: 0;
    }
  }

  .ql-preview {
    color: var(--blue-2);
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 1px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--blue-2);
    }
  }
}

// table
.ql-editor td {
  border-color: inherit;
}

//////////////////////
///*    PICKER   *////
//////////////////////
.pickr {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  overflow: hidden;
  .pcr-button {
    width: 0;
    height: 0;
    padding: 0;
    &::before {
      width: 0;
      height: 0;
    }
  }
}

.pcr-app {
  border-radius: 10px;
  overflow: hidden;
  background: var(--grey);
  border: 1px solid var(--grey-740);
  font-family: "Montserrat", sans-serif;
}
.pcr-app[data-theme="nano"] .pcr-selection {
  grid-gap: 0;
  height: auto;
  grid-template-rows: 5fr auto;
}
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-preview {
  width: auto;
  margin: 0 15px 0 10px;
  justify-content: flex-start;
  grid-area: 2 / 1 / 3 / 2;
}
.pcr-app[data-theme="nano"]
  .pcr-selection
  .pcr-color-preview
  .pcr-current-color {
  border-radius: 6px;
  border: 1px solid var(--grey-340);
}
.pcr-app .pcr-selection .pcr-picker {
  height: 12px;
  width: 12px;
  border: 1px solid var(--white);
  border-radius: 100%;
}
.pcr-app .pcr-selection .pcr-color-palette {
  cursor: crosshair;
  margin-bottom: 10px;
}
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-palette {
  height: 8em;
}
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-chooser {
  grid-area: 2 / 2 / 3 / 3;
}

.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-chooser,
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-opacity {
  height: 5px;
  margin: 0 10px 0 0;
  cursor: default;
}
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-chooser .pcr-picker,
.pcr-app[data-theme="nano"] .pcr-selection .pcr-color-opacity .pcr-picker {
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-50%) scale(1.2);
  }
}

.pcr-app .pcr-swatches > button {
  transition: box-shadow 0.3s;
  border-radius: 3px;

  &:hover {
    box-shadow: 0 0 5px 2px var(--pcr-color);
  }
}
.pcr-app button.pcr-active {
  box-shadow: 0 0 5px 2px var(--pcr-color);
}

.pcr-app .pcr-interaction {
  margin: 0;
}
.pcr-app .pcr-interaction .pcr-result {
  flex: 1 1 100%;
  color: var(--white);
  flex-grow: 1;
  border-radius: 5px;
  background: var(--black);
  border: 1px solid var(--grey-740);
  position: relative;
  display: block;

  &:invalid {
    @include Invalid();
  }
}
.pcr-app .pcr-interaction input:focus {
  @include Focus();
}

.pcr-app .pcr-interaction .pcr-type {
  border-radius: 5px;
  background-color: var(--grey-660);
  transition: background-color 0.3s, filter 0.3s;
  color: var(--white);
  order: 2;

  &:not(.active):hover {
    filter: brightness(var(--brightness-rating));
  }
}
.pcr-app .pcr-interaction .pcr-type.active {
  color: var(--black);
  background: var(--blue-2);
  font-weight: 600;
  &:hover {
    filter: brightness(1.2);
  }
}
.pcr-app .pcr-interaction .pcr-save {
  background: var(--blue-2);
  color: var(--black);
  font-weight: 600;
  border-radius: 5px;
  margin-left: auto;
  transition: filter 0.3s;
  order: 3;

  &:not(:disabled):hover {
    filter: brightness(1.2);
  }
  &:disabled {
    cursor: default;
    filter: brightness(0.8);
  }
}

.pcr-error {
  color: #ff4b4b;
  font-size: 12px;
  font-weight: 500;
  order: 1;
  width: 100%;
  flex-grow: 1;
}
</style>
