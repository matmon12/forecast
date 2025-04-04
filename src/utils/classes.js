export const getClasses = (mainClass) => {
  return {
    select: {
      root: `${mainClass}-select`,
      label: `${mainClass}-select-label`,
      dropdown: `${mainClass}-select-dropdown`,
      dropdownicon: `${mainClass}-select-dropdownicon`,
      overlay: `${mainClass}-select-overlay`,
      listcontainer: `${mainClass}-select-listcontainer`,
      list: `${mainClass}-select-list`,
      option: `${mainClass}-select-option`,
      optionlabel: `${mainClass}-select-optionlabel`,
    },
    button: {
      root: `${mainClass}-btn`,
      loadingIcon: `${mainClass}-btn-loading-icon`,
      icon: `${mainClass}-btn-icon`,
      label: `${mainClass}-btn-label`,
    },
    toolbar: {
      root: `${mainClass}-toolbar`,
      start: `${mainClass}-toolbar-start`,
      center: `${mainClass}-toolbar-center`,
      end: `${mainClass}-toolbar-end`,
    },
    datatable: {
      root: `${mainClass}-datatable`,
      mask: `${mainClass}-datatable-mask`,
      loadingIcon: `${mainClass}-datatable-loading-icon`,
      header: `${mainClass}-datatable-header`,
      paginator: `${mainClass}-datatable-paginator`,
      tableContainer: `${mainClass}-datatable-table-container`,
      virtualScroller: `${mainClass}-datatable-virtualscroller`,
      table: `${mainClass}-datatable-table`,
      virtualScrollerSpacer: `${mainClass}-datatable-virtualscroller-spacer`,
      footer: `${mainClass}-datatable-footer`,
      thead: `${mainClass}-datatable-thead`,
      headerRow: `${mainClass}-datatable-header-row`,
      tbody: `${mainClass}-datatable-tbody`,
      rowGroupHeader: `${mainClass}-datatable-row-group-header`,
      rowGroupHeaderCell: `${mainClass}-datatable-row-group-header-cell`,
      bodyRow: `${mainClass}-datatable-body-row`,
      rowExpansion: `${mainClass}-datatable-row-expansion`,
      rowExpansionCell: `${mainClass}-datatable-row-expansion-cell`,
      rowGroupFooter: `${mainClass}-datatable-row-group-footer`,
      rowGroupFooterCell: `${mainClass}-datatable-row-group-footer-cell`,
      emptyMessage: `${mainClass}-datatable-empty-message`,
      emptyMessageCell: `${mainClass}-datatable-empty-message-cell`,
      tfoot: `${mainClass}-datatable-tfoot`,
      footerRow: `${mainClass}-datatable-footer-row`,
      columnResizeIndicator: `${mainClass}-datatable-column-resize-indicator`,
      rowReorderIndicatorUp: `${mainClass}-datatable-row-reorder-indicator-up`,
      rowReorderIndicatorDown: `${mainClass}-datatable-row-reorder-indicator-down`,
      columnGroup: `${mainClass}-datatable-column-group`,
      row: `${mainClass}-datatable-row`,
    },
    column: {
      root: `${mainClass}-datatable-column`,
      headerCell: `${mainClass}-datatable-header-cell`,
      columnResizer: `${mainClass}-datatable-column-resizer`,
      columnheaderContent: `${mainClass}-datatable-column-header-content`,
      columnTitle: `${mainClass}-datatable-column-title`,
      sort: `${mainClass}-datatable-sort`,
      sortIcon: `${mainClass}-datatable-sort-icon`,
      pcSortBadge: `${mainClass}-datatable-sort-badge`,
      filter: `${mainClass}-datatable-filter`,
      filterElementContainer: `${mainClass}-datatable-filter-element-container`,
      pcColumnFilterButton: `${mainClass}-datatable-column-filter-button`,
      filterMenuIcon: `${mainClass}-datatable-filter-menu-icon`,
      pcColumnFilterClearButton: `${mainClass}-datatable-column-filter-clear-button`,
      filterClearIcon: `${mainClass}-datatable-filter-clear-icon`,
      filterOverlay: `${mainClass}-datatable-filter-overlay`,
      filterConstraintList: `${mainClass}-datatable-filter-constraint-list`,
      filterConstraint: `${mainClass}-datatable-filter-constraint`,
      filterConstraintSeparator: `${mainClass}-datatable-filter-constraint-separator`,
      filterOperator: `${mainClass}-datatable-filter-operator`,
      pcFilterOperatorDropdown: `${mainClass}-datatable-filter-operator-dropdown`,
      filterRuleList: `${mainClass}-datatable-filter-rule-list`,
      filterRule: `${mainClass}-datatable-filter-rule`,
      pcFilterConstraintDropdown: `${mainClass}-datatable-filter-constraint-dropdown`,
      filterRemove: `${mainClass}-datatable-filter-remove`,
      pcFilterRemoveRuleButton: `${mainClass}-datatable-filter-remove-rule-button`,
      filterAddButtonContainer: `${mainClass}-datatable-filter-add-button-container`,
      pcFilterAddRuleButton: `${mainClass}-datatable-filter-add-rule-button`,
      filterButtonbar: `${mainClass}-datatable-filter-buttonbar`,
      pcFilterClearButton: `${mainClass}-datatable-filter-clear-button`,
      pcFilterApplyButton: `${mainClass}-datatable-filter-apply-button`,
      rowToggleButton: `${mainClass}-datatable-row-toggle-button`,
      rowToggleIcon: `${mainClass}-datatable-row-toggle-icon`,
      bodyCell: `${mainClass}-datatable-body-cell`,
      reorderableRowHandle: `${mainClass}-datatable-reorderable-row-handle`,
      pcRowRadiobutton: `${mainClass}-datatable-row-radiobutton`,
      pcRowCheckbox: `${mainClass}-datatable-row-checkbox`,
      pcRowEditorInit: `${mainClass}-datatable-row-editor-init`,
      pcRowEditorSave: `${mainClass}-datatable-row-editor-save`,
      pcRowEditorCancel: `${mainClass}-datatable-row-editor-cancel`,
      footerCell: `${mainClass}-datatable-footer-cell`,
      columnFooter: `${mainClass}-datatable-column-footer`,
      bodyCellContent: `${mainClass}-datatable-body-cell-content`,
    },
    iconfield: {
      root: `${mainClass}-iconfield`,
    },
    inputicon: {
      root: `${mainClass}-inputicon`,
    },
    inputtext: {
      root: `${mainClass}-inputtext`,
    },
    rating: {
      root: `${mainClass}-rating`,
      option: `${mainClass}-rating-option`,
      onIcon: `${mainClass}-rating-on-icon`,
      offIcon: `${mainClass}-rating-off-icon`,
    },
    tag: {
      root: `${mainClass}-tag`,
      icon: `${mainClass}-tag-icon`,
      label: `${mainClass}-tag-label`,
    },
    dialog: {
      root: `${mainClass}-dialog`,
      header: `${mainClass}-dialog-header`,
      title: `${mainClass}-dialog-title`,
      headerActions: `${mainClass}-dialog-header-actions`,
      pcMaximizeButton: `${mainClass}-dialog-maximize-button`,
      pcCloseButton: `${mainClass}-dialog-close-button`,
      content: `${mainClass}-dialog-content`,
      footer: `${mainClass}-dialog-footer`,
      mask: `${mainClass}-dialog-mask`,
    },
    textarea: {
      root: `${mainClass}-textarea`,
    },
    radiobutton: {
      root: `${mainClass}-radiobutton`,
      input: `${mainClass}-radiobutton-input`,
      box: `${mainClass}-radiobutton-box`,
      icon: `${mainClass}-radiobutton-icon`,
    },
    inputnumber: {
      root: `${mainClass}-inputnumber`,
      pcInput: `${mainClass}-inputnumber-input`,
      buttonGroup: `${mainClass}-inputnumber-button-group`,
      incrementButton: `${mainClass}-inputnumber-increment-button`,
      incrementIcon: `${mainClass}-inputnumber-increment-icon`,
      decrementButton: `${mainClass}-inputnumber-decrement-button`,
      decrementIcon: `${mainClass}-inputnumber-decrement-icon`,
    },
    checkbox: {
      root: `${mainClass}-checkbox`,
      input: `${mainClass}-checkbox-input`,
      box: `${mainClass}-checkbox-box`,
    },
    avatar: {
      root: `${mainClass}-avatar`,
      label: `${mainClass}-avatar-label`,
      icon: `${mainClass}-avatar-icon`,
      image: `${mainClass}-avatar-image`,
    },
    paginator: {
      paginatorContainer: `${mainClass}-paginator-container`,
      root: `${mainClass}-paginator`,
      content: `${mainClass}-paginator-content`,
      contentStart: `${mainClass}-paginator-content-start`,
      first: `${mainClass}-paginator-first`,
      firstIcon: `${mainClass}-paginator-first-icon`,
      prev: `${mainClass}-paginator-prev`,
      prevIcon: `${mainClass}-paginator-prev-icon`,
      next: `${mainClass}-paginator-next`,
      nextIcon: `${mainClass}-paginator-next-icon`,
      last: `${mainClass}-paginator-last`,
      lastIcon: `${mainClass}-paginator-last-icon`,
      pages: `${mainClass}-paginator-pages`,
      page: `${mainClass}-paginator-page`,
      current: `${mainClass}-paginator-current`,
      pcRowPerPageDropdown: `${mainClass}-paginator-rpp-dropdown`,
      pcJumpToPageDropdown: `${mainClass}-paginator-jtp-dropdown`,
      pcJumpToPageInput: `${mainClass}-paginator-jtp-input`,
      contentEnd: `${mainClass}-paginator-content-end`,
    },
    message: {
      root: `${mainClass}-message`,
      content: `${mainClass}-message-content`,
      icon: `${mainClass}-message-icon`,
      text: `${mainClass}-message-text`,
      closeButton: `${mainClass}-message-close-button`,
      closeIcon: `${mainClass}-message-close-icon`,
    },
    fileupload: {
      root: `${mainClass}-fileupload`,
      input: `${mainClass}-fileupload-input`,
      header: `${mainClass}-fileupload-header`,
      pcChooseButton: `${mainClass}-fileupload-choose-button`,
      pcUploadButton: `${mainClass}-fileupload-upload-button`,
      pcCancelButton: `${mainClass}-fileupload-cancel-button`,
      content: `${mainClass}-fileupload-content`,
      pcProgressbar: `${mainClass}-fileupload-progressbar`,
      pcMessage: `${mainClass}-fileupload-message`,
      file: `${mainClass}-fileupload-file`,
      fileThumbnail: `${mainClass}-fileupload-file-thumbnail`,
      fileInfo: `${mainClass}-fileupload-file-info`,
      fileName: `${mainClass}-fileupload-file-name`,
      fileSize: `${mainClass}-fileupload-file-size`,
      pcFileBadge: `${mainClass}-fileupload-file-badge`,
      fileActions: `${mainClass}-fileupload-file-actions`,
      pcFileRemoveButton: `${mainClass}-fileupload-file-remove-button`,
      empty: `${mainClass}-fileupload-empty`,
      pcMessages: `${mainClass}-fileupload-messages`,
      pcButton: `${mainClass}-fileupload-button`,
    },
    image: {
      root: `${mainClass}-image`,
      image: `${mainClass}-image-img`,
      previewMask: `${mainClass}-image-preview-mask`,
      previewIcon: `${mainClass}-image-preview-icon`,
      mask: `${mainClass}-image-mask`,
      toolbar: `${mainClass}-image-toolbar`,
      rotateRightButton: `${mainClass}-image-rotate-right-button`,
      rotateRightIcon: `${mainClass}-image-rotate-right-icon`,
      rotateLeftButton: `${mainClass}-image-rotate-left-button`,
      rotateLeftIcon: `${mainClass}-image-rotate-left-icon`,
      zoomOutButton: `${mainClass}-image-zoom-out-button`,
      zoomOutIcon: `${mainClass}-image-zoom-out-icon`,
      zoomInButton: `${mainClass}-image-zoom-in-button`,
      zoomInIcon: `${mainClass}-image-zoom-in-icon`,
      closeButton: `${mainClass}-image-close-button`,
      closeIcon: `${mainClass}-image-close-icon`,
      originalContainer: `${mainClass}-image-original-container`,
      original: `${mainClass}-image-original`,
    },
    editor: {
      root: `${mainClass}-editor`,
      toolbar: `${mainClass}-editor-toolbar`,
      formats: `${mainClass}-editor-formats`,
      header: `${mainClass}-editor-header`,
      option: `${mainClass}-editor-option`,
      bold: `${mainClass}-editor-bold`,
      italic: `${mainClass}-editor-italic`,
      underline: `${mainClass}-editor-underline`,
      color: `${mainClass}-editor-color`,
      background: `${mainClass}-editor-background`,
      list: `${mainClass}-editor-list`,
      select: `${mainClass}-editor-select`,
      link: `${mainClass}-editor-link`,
      image: `${mainClass}-editor-image`,
      codeBlock: `${mainClass}-editor-codeBlock`,
      clean: `${mainClass}-editor-clean`,
      content: `${mainClass}-editor-content`,
    },
    tooltip: {
      root: `${mainClass}-tooltip`,
      text: `${mainClass}-tooltip-text`,
      arrow: `${mainClass}-tooltip-arrow`,
    },
    chip: {
      root: `${mainClass}-chip`,
      image: `${mainClass}-chip-image`,
      icon: `${mainClass}-chip-icon`,
      label: `${mainClass}-chip-label`,
      removeIcon: `${mainClass}-chip-remove-icon`,
    },
    confirmpopup: {
      root: `${mainClass}-confirmpopup`,
      content: `${mainClass}-confirmpopup-content`,
      icon: `${mainClass}-confirmpopup-icon`,
      message: `${mainClass}-confirmpopup-message`,
      footer: `${mainClass}-confirmpopup-footer`,
      pcRejectButton: `${mainClass}-confirmpopup-reject-button`,
      pcAcceptButton: `${mainClass}-confirmpopup-accept-button`,
    },
    multiselect: {
      root: `${mainClass}-multiselect`,
      labelContainer: `${mainClass}-multiselect-label-container`,
      label: `${mainClass}-multiselect-label`,
      chipItem: `${mainClass}-multiselect-chip-item`,
      pcChip: `${mainClass}-multiselect-chip`,
      chipIcon: `${mainClass}-multiselect-chip-icon`,
      dropdown: `${mainClass}-multiselect-dropdown`,
      loadingIcon: `${mainClass}-multiselect-loading-icon`,
      dropdownIcon: `${mainClass}-multiselect-dropdown-icon`,
      overlay: `${mainClass}-multiselect-overlay`,
      header: `${mainClass}-multiselect-header`,
      pcHeaderCheckbox: `${mainClass}-multiselect-header-checkbox`,
      pcFilterContainer: `${mainClass}-multiselect-filter-container`,
      pcFilter: `${mainClass}-multiselect-filter`,
      pcFilterIconContainer: `${mainClass}-multiselect-filter-icon-container`,
      filterIcon: `${mainClass}-multiselect-filter-icon`,
      listContainer: `${mainClass}-multiselect-list-container`,
      virtualScroller: `${mainClass}-multiselect-virtualscroller`,
      list: `${mainClass}-multiselect-list`,
      optionGroup: `${mainClass}-multiselect-option-group`,
      option: `${mainClass}-multiselect-option`,
      optionLabel: `${mainClass}-multiselect-option-label`,
      pcOptionCheckbox: `${mainClass}-multiselect-option-checkbox`,
      emptyMessage: `${mainClass}-multiselect-empty-message`,
      hiddenInputContainer: `${mainClass}-multiselect-hidden-input-container`,
      hiddenInput: `${mainClass}-multiselect-hidden-input`,
      hiddenFirstFocusableEl: `${mainClass}-multiselect-hidden-first-focusable-el`,
      hiddenFilterResult: `${mainClass}-multiselect-hidden-filter-result`,
      hiddenSelectedMessage: `${mainClass}-multiselect-hidden-selected-message`,
      hiddenLastFocusableEl: `${mainClass}-multiselect-hidden-last-focusable-el`,
    },
    datepicker: {
      root: `${mainClass}-datepicker`,
      pcInput: `${mainClass}-datepicker-input`,
      dropdown: `${mainClass}-datepicker-dropdown`,
      dropdownIcon: `${mainClass}-datepicker-dropdown-icon`,
      inputIconContainer: `${mainClass}-datepicker-input-icon-container`,
      inputIcon: `${mainClass}-datepicker-input-icon`,
      panel: `${mainClass}-datepicker-panel`,
      calendarContainer: `${mainClass}-datepicker-calendar-container`,
      calendar: `${mainClass}-datepicker-calendar`,
      header: `${mainClass}-datepicker-header`,
      pcPrevButton: `${mainClass}-datepicker-prev-button`,
      title: `${mainClass}-datepicker-title`,
      selectMonth: `${mainClass}-datepicker-select-month`,
      selectYear: `${mainClass}-datepicker-select-year`,
      decade: `${mainClass}-datepicker-decade`,
      dayView: `${mainClass}-datepicker-day-view`,
      pcNextButton: `${mainClass}-datepicker-next-button`,
      container: `${mainClass}-datepicker-container`,
      table: `${mainClass}-datepicker-table`,
      tableHeader: `${mainClass}-datepicker-tableheader`,
      tableHeaderRow: `${mainClass}-datepicker-tableheader-row`,
      weekHeader: `${mainClass}-datepicker-weekheader`,
      weekHeaderLabel: `${mainClass}-datepicker-weekheader-label`,
      tableHeaderCell: `${mainClass}-datepicker-tableheader-cell`,
      weekDayCell: `${mainClass}-datepicker-weekday-cell`,
      weekDay: `${mainClass}-datepicker-weekday`,
      tableBody: `${mainClass}-datepicker-table-body`,
      tableBodyRow: `${mainClass}-datepicker-table-body-row`,
      weekNumber: `${mainClass}-datepicker-weeknumber`,
      weekLabelContainer: `${mainClass}-datepicker-weeklabel-container`,
      dayCell: `${mainClass}-datepicker-day-cell`,
      day: `${mainClass}-datepicker-day`,
      monthView: `${mainClass}-datepicker-month-view`,
      month: `${mainClass}-datepicker-month`,
      yearView: `${mainClass}-datepicker-year-view`,
      year: `${mainClass}-datepicker-year`,
      timePicker: `${mainClass}-datepicker-time-picker`,
      hourPicker: `${mainClass}-datepicker-hour-picker`,
      hour: `${mainClass}-datepicker-hour`,
      separatorContainer: `${mainClass}-datepicker-separator-container`,
      separator: `${mainClass}-datepicker-separator`,
      minutePicker: `${mainClass}-datepicker-minute-picker`,
      minute: `${mainClass}-datepicker-minute`,
      secondPicker: `${mainClass}-datepicker-second-picker`,
      second: `${mainClass}-datepicker-second`,
      ampmPicker: `${mainClass}-datepicker-ampm-picker`,
      ampm: `${mainClass}-datepicker-ampm`,
      buttonbar: `${mainClass}-datepicker-buttonbar`,
      pcIncrementButton: `${mainClass}-datepicker-increment-button`,
      pcDecrementButton: `${mainClass}-datepicker-decrement-button`,
      pcTodayButton: `${mainClass}-datepicker-today-button`,
      pcClearButton: `${mainClass}-datepicker-clear-button`,
      hiddenSelectedDay: `${mainClass}-datepicker-hidden-selectedday`,
      hiddenMonth: `${mainClass}-datepicker-hidden-month`,
      hiddenYear: `${mainClass}-datepicker-hidden-year`,
    },
    password: {
      root: `${mainClass}-password`,
      pcInputText: `${mainClass}-password-input`,
      maskIcon: `${mainClass}-password-mask-icon`,
      unmaskIcon: `${mainClass}-password-unmask-icon`,
      overlay: `${mainClass}-password-overlay`,
      content: `${mainClass}-password-content`,
      meter: `${mainClass}-password-meter`,
      meterLabel: `${mainClass}-password-meter-label`,
      meterText: `${mainClass}-password-meter-text`,
    },
    toast: {
      root: `${mainClass}-toast`,
      message: `${mainClass}-toast-message`,
      messageContent: `${mainClass}-toast-message-content`,
      messageIcon: `${mainClass}-toast-message-icon`,
      messageText: `${mainClass}-toast-message-text`,
      summary: `${mainClass}-toast-summary`,
      detail: `${mainClass}-toast-detail`,
      buttonContainer: `${mainClass}-toast-button-container`,
      closeButton: `${mainClass}-toast-close-button`,
      closeIcon: `${mainClass}-toast-close-icon`,
    },
    drawer: {
      root: `${mainClass}-drawer`,
      header: `${mainClass}-drawer-header`,
      title: `${mainClass}-drawer-title`,
      pcCloseButton: `${mainClass}-drawer-close-button`,
      content: `${mainClass}-drawer-content`,
      footer: `${mainClass}-drawer-footer`,
      mask: `${mainClass}-drawer-mask`,
    },
    panel: {
      root: `${mainClass}-panel`,
      header: `${mainClass}-panel-header`,
      title: `${mainClass}-panel-title`,
      headerActions: `${mainClass}-panel-header-actions`,
      pcToggleButton: `${mainClass}-panel-toggle-button`,
      contentContainer: `${mainClass}-panel-content-container`,
      content: `${mainClass}-panel-content`,
      footer: `${mainClass}-panel-footer`,
    },
    menu: {
      root: `${mainClass}-menu`,
      list: `${mainClass}-menu-list`,
      submenuLabel: `${mainClass}-menu-submenu-item`,
      item: `${mainClass}-menu-item`,
      itemContent: `${mainClass}-menu-item-content`,
      itemLink: `${mainClass}-menu-item-link`,
      itemIcon: `${mainClass}-menu-item-icon`,
      itemLabel: `${mainClass}-menu-item-label`,
      separator: `${mainClass}-menu-separator`,
      start: `${mainClass}-menu-start`,
      end: `${mainClass}-menu-end`,
    },
    toggleswitch: {
      root: `${mainClass}-toggleswitch`,
      input: `${mainClass}-toggleswitch-input`,
      slider: `${mainClass}-toggleswitch-slider`,
    },
    autocomplete: {
      root: `${mainClass}-autocomplete`,
      inputMultiple: `${mainClass}-autocomplete-input-multiple`,
      chipItem: `${mainClass}-autocomplete-chip-item`,
      chipIcon: `${mainClass}-autocomplete-chip-icon`,
      inputChip: `${mainClass}-autocomplete-input-chip`,
      loader: `${mainClass}-autocomplete-loader`,
      dropdown: `${mainClass}-autocomplete-dropdown`,
      dropdownIcon: `${mainClass}-autocomplete-dropdown-icon`,
      overlay: `${mainClass}-autocomplete-overlay`,
      virtualScroller: `${mainClass}-autocomplete-virtual-scroller`,
      listContainer: `${mainClass}-autocomplete-list-container`,
      list: `${mainClass}-autocomplete-list`,
      optionGroup: `${mainClass}-autocomplete-option-group`,
      option: `${mainClass}-autocomplete-option`,
      emptyMessage: `${mainClass}-autocomplete-empty-message`,
      searchResultMessage: `${mainClass}-autocomplete-search-result-message`,
      selectedMessage: `${mainClass}-autocomplete-selected-message`,
    }
  };
};
