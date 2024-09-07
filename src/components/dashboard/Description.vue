<template>
  <Editor
    v-model="description"
    editorStyle="height: 240px"
    :pt="getClasses('dashboard').editor"
    ref="editor"
    placeholder="Enter text of post here..."
    :modules="{
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true,
      },
    }"
    @load="onLoadEditor"
  >
    <template v-slot:toolbar>
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
    </template>
  </Editor>
</template>

<script setup>
import { ref, defineProps, defineModel, computed, watch } from "vue";
import { getClasses } from "@/utils/classes";
import Pickr from "@simonwep/pickr";
import { Delta } from "quill/core";
import debounce from "lodash.debounce";
import "@simonwep/pickr/dist/themes/nano.min.css";

const description = defineModel("description");
const lengthDescription = defineModel("length");

const editor = ref();
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
]);

const showColorPicker = (value) => {
  pickerMode = "color";
  if (value === "color-picker" || value === "new-color") {
    pickr.show();
  } else {
    editor.value.quill.format("color", value);
  }
};

const showBackgroundPicker = (value) => {
  pickerMode = "backgroundColor";
  if (value === "color-picker" || value === "new-color") {
    pickr.show();
  } else {
    editor.value.quill.format("background", value);
  }
};

const onLoadEditor = () => {
  // add default value
  editor.value.quill.clipboard.dangerouslyPasteHTML(description.value);
  // length text
  updateLength();

  pickr = Pickr.create({
    el: ".picker",
    theme: "nano",
    default: "#000000",

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

  // add validation
  var errorText;
  const patternColor =
    "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*(,\\s*1)?\\)$";
  const regexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  const inputPicker = document.querySelector(".pcr-result");
  const saveButton = document.querySelector(".pcr-save");
  const container = document.querySelector(".pcr-interaction");

  inputPicker.setAttribute("pattern", patternColor);

  pickr.on("change", (color) => {
    const formatColor = color.toHEXA().toString();
    if (regexColor.test(formatColor)) {
      saveButton.disabled = false;

      if (errorText) {
        errorText.style.display = "none";
      }
    } else {
      saveButton.disabled = true;

      if (!errorText) {
        errorText = document.createElement("span");
        errorText.innerText = "Invalid color format!";
        errorText.className = "pcr-error";
        container.appendChild(errorText);
      } else {
        errorText.style.display = "block";
      }
    }
  });

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
      editor.value.quill.format("color", colorPicker.value);

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
        ".dashboard-editor-color .ql-color-label.ql-stroke.ql-fill"
      );
      const button = document.querySelector(
        ".dashboard-editor-color .ql-picker-label"
      );
      line.style.fill = colorPicker.value;
      button.classList.add("ql-active");
    }
    if (pickerMode === "backgroundColor") {
      backgroundPicker.value = color.toHEXA().toString().toLowerCase();
      editor.value.quill.format("background", backgroundPicker.value);

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

  var toolbar = editor.value.quill.getModule("toolbar");
  toolbar.addHandler("color", showColorPicker);
  toolbar.addHandler("background", showBackgroundPicker);
};

watch(
  () => description.value,
  (newValue) => {
    updateLength();
  }
);

const updateLength = debounce(() => {
  lengthDescription.value = editor.value.quill
    .getText()
    .replace(/\s+/g, "").length;
}, 300);
</script>

<style lang="scss" scoped></style>

<style lang="scss">
// editor
.dashboard {
  &-editor {
    &.is-invalid {
      .dashboard-editor-content {
        @include Invalid();
      }
    }
    &-toolbar {
      background-color: #000;
      font-family: "Montserrat", sans-serif;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      border-bottom: 0;
    }
    &-formats {
      border: 1px solid #4d4d4d;
      border-radius: 5px;
      margin-right: 0;
      background-color: #cccccc2d;
      padding: 2px;
      display: flex;
      width: min-content;
      position: relative;
    }
    &-header {
      &:has(> .ql-active) {
        background-color: #6b99c6;
        font-weight: 600;
      }
      & .ql-picker-item + .ql-picker-item {
        margin-top: 5px;
      }
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
    &-link {
    }
    &-image {
    }
    &-codeBlock {
    }
    &-clean {
    }
    &-content {
      display: flex;
      flex-direction: column;
      position: relative;
      font-family: "Montserrat", sans-serif;
      font-size: 14px;
      border-top: 1px solid var(--p-editor-content-border-color);
      transition: box-shadow 0.3s;
    }
  }
}

// tooltip
.p-tooltip .editor {
  &-tooltip {
    &-text {
      background: #c5c5c5;
      color: #000000;
      font-weight: 500;
      padding: 5px 6px;
    }
  }
}
.p-tooltip.p-tooltip-bottom {
  .editor-tooltip-arrow {
    border-bottom-color: #c5c5c5;
  }
}
.p-tooltip.p-tooltip-top {
  .editor-tooltip-arrow {
    border-top-color: #c5c5c5;
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
    background-color: #424242;
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
  & .ql-picker-label {
    color: #7ca9d5;
  }
  & .ql-stroke {
    stroke: #7ca9d5;
  }
  & .ql-color-label {
    fill: #7ca9d5;
  }

  // dropdown
  .ql-picker-options {
    background-color: #1a1a1a;
  }
  &:not(.ql-icon-picker) .ql-picker-item {
    padding: 5px;
  }
  .ql-picker-options .ql-picker-item:not(.ql-selected):hover {
    background-color: #363636;
  }
}

// dropdown
.ql-picker-options {
  padding: 5px;
}
.ql-picker-item {
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
    background-color: $blue;
    color: #000;
    font-weight: 600;

    &:before {
      content: "Pick color...";
      font-size: 12px;
      line-height: 1;
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
}

.ql-expanded
  .ql-picker-options
  .ql-picker-item:not(.ql-selected)[data-value="color-picker"]:hover {
  background-color: $blue;
  border-color: inherit;
  background-color: #96b5e7;
}

// new color
.ql-picker-item {
  &[data-value="new-color"] {
    background-color: #000;
    position: relative;
    background-color: #262626;

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
  border-color: #515151;
  margin: 0;
  transition: border-color 0.3s;
}
.ql-color-picker .ql-picker-item:hover {
  border-color: #ffffff;
}

// align list
.ql-icon-picker .ql-picker-item {
  padding: 2px;
  .ql-stroke {
    stroke: #bababa;
  }
  &.ql-selected {
    .ql-stroke {
      stroke: #000;
    }
  }
}

// editor
.ql-editor {
  order: 1;
  @include Scroll(7px, 7px, #333333, #7d7d7d);
  &.ql-blank::before {
    color: #a1a1aa;
    font-style: normal;
  }
  .ql-video{
    width: 100%;
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
  background: #242424;
  border: 1px solid #7ca9d5;
  box-shadow: 0 0 10px #7ca9d5;
  color: #bbbbbb;
  padding: 5px 12px;
  border-radius: 5px;

  &:not(.ql-hidden) {
    display: flex;
    align-items: center;
  }

  &::before {
    color: #fff;
  }

  input[type="text"] {
    border: 1px solid #989898;
    border-radius: 5px;
    color: #fff;
    &::placeholder {
      color: #8f8f8f;
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
    background-color: $blue;
    display: flex;
    align-items: center;
    &::after {
      margin-left: 0;
      padding-right: 0;
      border-right: none;
    }
  }
  .ql-remove {
    border: 1px solid $blue;
    color: #fff;
    &::before {
      margin-left: 0;
    }
  }

  .ql-preview {
    color: $blue;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 1px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: $blue;
    }
  }
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
  background: $grey;
  border: 1px solid #5e5e5e;
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
  border: 1px solid #8e8e8e;
}
.pcr-app .pcr-selection .pcr-picker {
  height: 12px;
  width: 12px;
  border: 1px solid #fff;
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
  color: #ffffff;
  flex-grow: 1;
  border-radius: 5px;
  background: $black;
  border: 1px solid #555555;
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
  background-color: #5d5d5d;
  transition: background-color 0.3s, filter 0.3s;
  color: #fff;
  order: 2;

  &:not(.active):hover {
    background-color: #727272;
  }
}
.pcr-app .pcr-interaction .pcr-type.active {
  color: #000;
  background: $blue;
  font-weight: 600;
  &:hover {
    filter: brightness(1.2);
  }
}
.pcr-app .pcr-interaction .pcr-save {
  background: $blue;
  color: $black;
  font-weight: 600;
  border-radius: 5px;
  margin-left: auto;
  transition: filter 0.3s;
  order: 3;

  &:not(:disabled):hover {
    filter: brightness(0.8);
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
