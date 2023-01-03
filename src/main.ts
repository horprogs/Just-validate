import {
  isEmail,
  isEmpty,
  isLengthMoreThanMax,
  isNumberMoreThanMax,
  isLengthLessThanMin,
  isNumberLessThanMin,
  isNumber,
  isPassword,
  isStrongPassword,
  isInvalidOrEmptyString,
  isInteger,
} from './utils/validationUtils';
import {
  EventListenerInterface,
  FieldConfigInterface,
  FieldRuleInterface,
  GlobalConfigInterface,
  GroupFieldInterface,
  GroupFieldsInterface,
  GroupRuleInterface,
  GroupRules,
  Rules,
  FieldsInterface,
  LocaleInterface,
  CustomStyleTagIds,
  TooltipPositionType,
  TooltipInstance,
  FileRuleValueInterface,
  FilesRuleValueInterface,
  ElemValueType,
  CustomMessageFuncType,
  ShowLabelsInterface,
  FieldRuleValueType,
  FieldSelectorType,
} from './modules/interfaces';
import {
  DEFAULT_ERROR_FIELD_MESSAGE,
  defaultDictionary,
} from './modules/messages';
import {
  getClassList,
  getClosestParent,
  getNodeParents,
  isElement,
  isPromise,
} from './utils/helperUtils';
import { errorLabelCss } from './modules/inlineStyles.compressed';
import { TOOLTIP_ARROW_HEIGHT } from './modules/const';

const defaultGlobalConfig: GlobalConfigInterface = {
  errorFieldStyle: {
    color: '#b81111',
    border: '1px solid #B81111',
  },
  errorFieldCssClass: 'just-validate-error-field',
  successFieldCssClass: 'just-validate-success-field',
  errorLabelStyle: {
    color: '#b81111',
  },
  errorLabelCssClass: 'just-validate-error-label',
  successLabelCssClass: 'just-validate-success-label',
  focusInvalidField: true,
  lockForm: true,
  testingMode: false,
  validateBeforeSubmitting: false,
};

class JustValidate {
  form: HTMLFormElement | null = null;
  fields: FieldsInterface = {};
  groupFields: GroupFieldsInterface = {};
  errors: {
    [key: string]: {
      message?: string;
    };
  } = {};
  isValid = false;
  isSubmitted = false;
  globalConfig: GlobalConfigInterface = defaultGlobalConfig;
  errorLabels: { [name: string]: HTMLDivElement } = {};
  successLabels: { [name: string]: HTMLDivElement } = {};
  eventListeners: EventListenerInterface[] = [];
  dictLocale: LocaleInterface[] = defaultDictionary;
  currentLocale = 'en';
  customStyleTags: { [id: string]: HTMLStyleElement } = {};
  onSuccessCallback?: (event?: Event) => void;
  onFailCallback?: (
    fields: FieldsInterface,
    groups: GroupFieldsInterface
  ) => void;
  tooltips: TooltipInstance[] = [];
  lastScrollPosition?: number;
  isScrollTick?: boolean;
  fieldIds: Map<FieldSelectorType, string> = new Map();

  constructor(
    form: string | Element,
    globalConfig?: Partial<GlobalConfigInterface>,
    dictLocale?: LocaleInterface[]
  ) {
    this.initialize(form, globalConfig, dictLocale);
  }

  initialize(
    form: string | Element,
    globalConfig?: Partial<GlobalConfigInterface>,
    dictLocale?: LocaleInterface[]
  ): void {
    this.form = null;
    this.errors = {};
    this.isValid = false;
    this.isSubmitted = false;
    this.globalConfig = defaultGlobalConfig;
    this.errorLabels = {};
    this.successLabels = {};
    this.eventListeners = [];
    this.customStyleTags = {};
    this.tooltips = [];
    this.currentLocale = 'en';

    if (typeof form === 'string') {
      const elem = document.querySelector(form) as HTMLFormElement;

      if (!elem) {
        throw Error(
          `Form with ${form} selector not found! Please check the form selector`
        );
      }
      this.setForm(elem);
    } else if (form instanceof HTMLFormElement) {
      this.setForm(form);
    } else {
      throw Error(
        `Form selector is not valid. Please specify a string selector or a DOM element.`
      );
    }

    this.globalConfig = { ...defaultGlobalConfig, ...globalConfig };

    if (dictLocale) {
      this.dictLocale = [...dictLocale, ...defaultDictionary];
    }

    if (this.isTooltip()) {
      const styleTag = document.createElement('style');
      styleTag.textContent = errorLabelCss;

      this.customStyleTags[CustomStyleTagIds.Label] =
        document.head.appendChild(styleTag);

      this.addListener('scroll', document, this.handleDocumentScroll);
    }
  }

  getKeyByFieldSelector = (field: FieldSelectorType): string | undefined => {
    return this.fieldIds.get(field);
  };

  getFieldSelectorByKey = (key: string): FieldSelectorType | undefined => {
    for (const [fieldSelector, k] of this.fieldIds) {
      if (key === k) {
        return fieldSelector;
      }
    }

    return undefined;
  };

  getCompatibleFields = (): FieldsInterface => {
    const fields = {};

    Object.keys(this.fields).forEach((key) => {
      let newKey = key;
      const fieldSelector = this.getFieldSelectorByKey(key);

      if (typeof fieldSelector === 'string') {
        newKey = fieldSelector;
      }
      fields[newKey] = { ...this.fields[key] };
    });

    return fields;
  };

  setKeyByFieldSelector = (field: FieldSelectorType): string => {
    if (this.fieldIds.has(field)) {
      return this.fieldIds.get(field)!;
    }

    const key = String(this.fieldIds.size + 1);
    this.fieldIds.set(field, key);
    return key;
  };

  refreshAllTooltips = (): void => {
    this.tooltips.forEach((item) => {
      item.refresh();
    });
  };

  handleDocumentScroll = (): void => {
    this.lastScrollPosition = window.scrollY;

    if (!this.isScrollTick) {
      window.requestAnimationFrame(() => {
        this.refreshAllTooltips();
        this.isScrollTick = false;
      });
      this.isScrollTick = true;
    }
  };

  getLocalisedString(
    rule?: Rules | GroupRules,
    ruleValue?: FieldRuleValueType,
    customMsg?: string
  ): string {
    const search = customMsg ?? rule;
    let localisedStr = this.dictLocale.find((item) => item.key === search)
      ?.dict[this.currentLocale];

    if (!localisedStr) {
      if (customMsg) {
        localisedStr = customMsg;
      }
    }

    if (localisedStr && ruleValue !== undefined) {
      switch (rule) {
        case Rules.MaxLength:
        case Rules.MinLength:
        case Rules.MaxNumber:
        case Rules.MinNumber:
        case Rules.MinFilesCount:
        case Rules.MaxFilesCount:
          localisedStr = localisedStr.replace(':value', String(ruleValue));
      }
    }

    return localisedStr || customMsg || DEFAULT_ERROR_FIELD_MESSAGE;
  }

  getFieldErrorMessage(
    fieldRule: FieldRuleInterface,
    elem: HTMLInputElement
  ): string {
    const msg =
      typeof fieldRule.errorMessage === 'function'
        ? fieldRule.errorMessage(this.getElemValue(elem), this.fields)
        : fieldRule.errorMessage;

    return this.getLocalisedString(fieldRule.rule, fieldRule.value, msg);
  }

  getFieldSuccessMessage(
    successMessage: string | CustomMessageFuncType,
    elem: HTMLInputElement
  ): string | undefined {
    const msg =
      typeof successMessage === 'function'
        ? successMessage(this.getElemValue(elem), this.fields)
        : successMessage;

    return this.getLocalisedString(undefined, undefined, msg);
  }

  getGroupErrorMessage(groupRule: GroupRuleInterface): string {
    return this.getLocalisedString(
      groupRule.rule,
      undefined,
      groupRule.errorMessage
    );
  }

  getGroupSuccessMessage(groupRule: GroupRuleInterface): string | undefined {
    if (!groupRule.successMessage) {
      return undefined;
    }

    return this.getLocalisedString(
      undefined,
      undefined,
      groupRule.successMessage
    );
  }

  setFieldInvalid(key: string, fieldRule: FieldRuleInterface): void {
    this.fields[key].isValid = false;
    this.fields[key].errorMessage = this.getFieldErrorMessage(
      fieldRule,
      this.fields[key].elem
    );
  }

  setFieldValid(
    key: string,
    successMessage?: string | CustomMessageFuncType
  ): void {
    this.fields[key].isValid = true;
    if (successMessage !== undefined) {
      this.fields[key].successMessage = this.getFieldSuccessMessage(
        successMessage,
        this.fields[key].elem
      );
    }
  }

  setGroupInvalid(key: string, groupRule: GroupRuleInterface): void {
    this.groupFields[key].isValid = false;
    this.groupFields[key].errorMessage = this.getGroupErrorMessage(groupRule);
  }

  setGroupValid(key: string, groupRule: GroupRuleInterface): void {
    this.groupFields[key].isValid = true;
    this.groupFields[key].successMessage =
      this.getGroupSuccessMessage(groupRule);
  }

  getElemValue(elem: HTMLInputElement): ElemValueType {
    switch (elem.type) {
      case 'checkbox':
        return elem.checked;
      case 'file':
        return elem.files;
      default:
        return elem.value;
    }
  }

  validateGroupRule(
    key: string,
    elems: HTMLInputElement[],
    groupRule: GroupRuleInterface
  ): Promise<any> | void {
    switch (groupRule.rule) {
      case GroupRules.Required: {
        if (elems.every((elem) => !elem.checked)) {
          this.setGroupInvalid(key, groupRule);
        } else {
          this.setGroupValid(key, groupRule);
        }
      }
    }
  }

  validateFieldRule(
    key: string,
    elem: HTMLInputElement,
    fieldRule: FieldRuleInterface,
    afterInputChanged = false
  ): Promise<any> | void {
    const ruleValue = fieldRule.value;
    const elemValue = this.getElemValue(elem);

    if (fieldRule.plugin) {
      const result = fieldRule.plugin(
        elemValue as string | boolean,
        this.fields
      );

      if (!result) {
        this.setFieldInvalid(key, fieldRule);
      }
      return;
    }

    switch (fieldRule.rule) {
      case Rules.Required: {
        if (isEmpty(elemValue)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.Email: {
        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (!isEmail(elemValue as string)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.MaxLength: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (isLengthMoreThanMax(elemValue as string, ruleValue)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.MinLength: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (isLengthLessThanMin(elemValue as string, ruleValue)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.Password: {
        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (!isPassword(elemValue as string)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.StrongPassword: {
        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (!isStrongPassword(elemValue as string)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.Number: {
        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (!isNumber(elemValue as string)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.Integer: {
        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        if (!isInteger(elemValue as string)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.MaxNumber: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        const num = +(elemValue as string);

        if (Number.isNaN(num) || isNumberMoreThanMax(num, ruleValue)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.MinNumber: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (isInvalidOrEmptyString(elemValue)) {
          break;
        }

        const num = +(elemValue as string);

        if (Number.isNaN(num) || isNumberLessThanMin(num, ruleValue)) {
          this.setFieldInvalid(key, fieldRule);
        }
        break;
      }

      case Rules.CustomRegexp: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          return;
        }

        let regexp;

        try {
          regexp = new RegExp(ruleValue as string | RegExp);
        } catch (e) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] should be a valid regexp. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        const str = String(elemValue);

        if (str !== '' && !regexp.test(str)) {
          this.setFieldInvalid(key, fieldRule);
        }

        break;
      }

      case Rules.MinFilesCount: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (
          Number.isFinite((elemValue as FileList)?.length) &&
          (elemValue as FileList).length < ruleValue
        ) {
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        break;
      }

      case Rules.MaxFilesCount: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (typeof ruleValue !== 'number') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        if (
          Number.isFinite((elemValue as FileList)?.length) &&
          (elemValue as FileList).length > ruleValue
        ) {
          this.setFieldInvalid(key, fieldRule);
          break;
        }

        break;
      }

      case Rules.Files: {
        if (ruleValue === undefined) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          return;
        }

        if (typeof ruleValue !== 'object') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be an object. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          return;
        }

        const filesConfig = (ruleValue as FilesRuleValueInterface).files;

        if (typeof filesConfig !== 'object') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${key}] field should be an object with files array. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          return;
        }

        const isFilePropsInvalid = (
          file: File,
          fileConfig: FileRuleValueInterface
        ): boolean => {
          const minSizeInvalid =
            Number.isFinite(fileConfig.minSize) &&
            file.size < fileConfig.minSize!;

          const maxSizeInvalid =
            Number.isFinite(fileConfig.maxSize) &&
            file.size > fileConfig.maxSize!;

          const nameInvalid =
            Array.isArray(fileConfig.names) &&
            !fileConfig.names.includes(file.name);

          const extInvalid =
            Array.isArray(fileConfig.extensions) &&
            !fileConfig.extensions.includes(
              file.name.split('.')[file.name.split('.').length - 1]
            );

          const typeInvalid =
            Array.isArray(fileConfig.types) &&
            !fileConfig.types.includes(file.type);

          return (
            minSizeInvalid ||
            maxSizeInvalid ||
            nameInvalid ||
            extInvalid ||
            typeInvalid
          );
        };

        if (typeof elemValue === 'object' && elemValue !== null) {
          for (
            let fileIdx = 0, len = elemValue.length;
            fileIdx < len;
            ++fileIdx
          ) {
            const file = elemValue.item(fileIdx);

            if (!file) {
              this.setFieldInvalid(key, fieldRule);
              break;
            }

            const filesInvalid = isFilePropsInvalid(file, filesConfig);

            if (filesInvalid) {
              this.setFieldInvalid(key, fieldRule);
              break;
            }
          }
        }

        break;
      }

      default: {
        if (typeof fieldRule.validator !== 'function') {
          console.error(
            `Validator for custom rule for [${key}] field should be a function. This field will be always invalid.`
          );
          this.setFieldInvalid(key, fieldRule);
          return;
        }

        const result = fieldRule.validator(
          elemValue as string | boolean,
          this.getCompatibleFields()
        );

        if (typeof result !== 'boolean' && typeof result !== 'function') {
          console.error(
            `Validator return value for [${key}] field should be boolean or function. It will be cast to boolean.`
          );
        }

        if (typeof result === 'function') {
          // we should not call async custom validator on every input change
          if (afterInputChanged) {
            this.fields[key].asyncCheckPending = true;
          } else {
            this.fields[key].asyncCheckPending = false;
            const promise = result();

            if (!isPromise(promise)) {
              console.error(
                `Validator function for custom rule for [${key}] field should return a Promise. This field will be always invalid.`
              );
              this.setFieldInvalid(key, fieldRule);
              return;
            }

            return promise
              .then((resp) => {
                if (!resp) {
                  this.setFieldInvalid(key, fieldRule);
                }
              })
              .catch(() => {
                this.setFieldInvalid(key, fieldRule);
              });
          }
        }

        if (!result) {
          this.setFieldInvalid(key, fieldRule);
        }
      }
    }
  }

  validateField(key: string, afterInputChanged = false): Promise<any> {
    const field = this.fields[key];

    field.isValid = true;
    const promises: Promise<any>[] = [];
    [...field.rules].reverse().forEach((rule) => {
      const res = this.validateFieldRule(
        key,
        field.elem,
        rule,
        afterInputChanged
      );

      if (isPromise(res)) {
        promises.push(res as Promise<any>);
      }
    });

    if (field.isValid) {
      this.setFieldValid(key, field.config?.successMessage);
    }

    return Promise.allSettled(promises);
  }

  public revalidateField(fieldSelector: FieldSelectorType): Promise<boolean> {
    if (typeof fieldSelector !== 'string' && !isElement(fieldSelector)) {
      throw Error(
        `Field selector is not valid. Please specify a string selector or a valid DOM element.`
      );
    }

    const key = this.getKeyByFieldSelector(fieldSelector);

    if (!key || !this.fields[key]) {
      console.error(`Field not found. Check the field selector.`);
      return Promise.reject();
    }

    return new Promise((resolve) => {
      this.validateField(key, true).finally(() => {
        this.clearFieldStyle(key);
        this.clearFieldLabel(key);
        this.renderFieldError(key);
        resolve(!!this.fields[key].isValid);
      });
    });
  }

  validateGroup(key: string, group: GroupFieldInterface): Promise<any> | void {
    const promises: Promise<any>[] = [];
    [...group.rules].reverse().forEach((rule) => {
      const res = this.validateGroupRule(key, group.elems, rule);

      if (isPromise(res)) {
        promises.push(res as Promise<any>);
      }
    });

    return Promise.allSettled(promises);
  }

  focusInvalidField(): void {
    for (const key in this.fields) {
      const field = this.fields[key];
      if (!field.isValid) {
        setTimeout(() => field.elem.focus(), 0);
        break;
      }
    }
  }

  afterSubmitValidation(forceRevalidation = false): void {
    this.renderErrors(forceRevalidation);

    if (this.globalConfig.focusInvalidField) {
      this.focusInvalidField();
    }
  }

  validate(forceRevalidation = false): Promise<any> {
    return new Promise<boolean>((resolve) => {
      const promises: Promise<any>[] = [];

      Object.keys(this.fields).forEach((key) => {
        const promise = this.validateField(key);

        if (isPromise(promise)) {
          promises.push(promise as Promise<any>);
        }
      });

      Object.keys(this.groupFields).forEach((key) => {
        const group = this.groupFields[key];
        const promise = this.validateGroup(key, group);

        if (isPromise(promise)) {
          promises.push(promise as Promise<any>);
        }
      });

      if (promises.length) {
        Promise.allSettled(promises).then(() => {
          this.afterSubmitValidation(forceRevalidation);
          resolve(true);
        });
      } else {
        this.afterSubmitValidation(forceRevalidation);
        resolve(false);
      }
    });
  }

  public revalidate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.validateHandler(undefined, true).finally(() => {
        if (this.globalConfig.focusInvalidField) {
          this.focusInvalidField();
        }
        resolve(this.isValid);
      });
    });
  }

  validateHandler(ev?: Event, forceRevalidation = false): Promise<any> {
    if (this.globalConfig.lockForm) {
      this.lockForm();
    }

    return this.validate(forceRevalidation).finally(() => {
      if (this.globalConfig.lockForm) {
        this.unlockForm();
      }

      if (this.isValid) {
        this.onSuccessCallback?.(ev);
      } else {
        this.onFailCallback?.(this.getCompatibleFields(), this.groupFields);
      }
    });
  }

  formSubmitHandler = (ev: Event): void => {
    ev.preventDefault();
    this.isSubmitted = true;

    this.validateHandler(ev);
  };

  setForm(form: HTMLFormElement): void {
    this.form = form;
    this.form.setAttribute('novalidate', 'novalidate');
    this.removeListener('submit', this.form, this.formSubmitHandler);
    this.addListener('submit', this.form, this.formSubmitHandler);
  }

  handleFieldChange = (target: HTMLInputElement): void => {
    let foundKey;

    for (const key in this.fields) {
      const field = this.fields[key];

      if (field.elem === target) {
        foundKey = key;
        break;
      }
    }

    if (!foundKey) {
      return;
    }

    this.validateField(foundKey, true);
  };

  handleGroupChange = (target: HTMLInputElement): void => {
    let currentGroup;
    let foundKey;

    for (const key in this.groupFields) {
      const group = this.groupFields[key];

      if (group.elems.find((elem) => elem === target)) {
        currentGroup = group;
        foundKey = key;
        break;
      }
    }

    if (!currentGroup || !foundKey) {
      return;
    }

    this.validateGroup(foundKey, currentGroup);
  };

  handlerChange = (ev: Event): void => {
    if (!ev.target) {
      return;
    }

    this.handleFieldChange(ev.target as HTMLInputElement);
    this.handleGroupChange(ev.target as HTMLInputElement);

    this.renderErrors();
  };

  addListener(
    type: string,
    elem: HTMLInputElement | Document | HTMLFormElement,
    handler: (ev: Event) => void
  ): void {
    elem.addEventListener(type, handler);
    this.eventListeners.push({ type, elem, func: handler });
  }

  removeListener(
    type: string,
    elem: HTMLInputElement | Document | HTMLFormElement,
    handler: (ev: Event) => void
  ): void {
    elem.removeEventListener(type, handler);
    this.eventListeners = this.eventListeners.filter(
      (item) => item.type !== type || item.elem !== elem
    );
  }

  public addField(
    fieldSelector: FieldSelectorType,
    rules: FieldRuleInterface[],
    config?: FieldConfigInterface
  ): JustValidate {
    if (typeof fieldSelector !== 'string' && !isElement(fieldSelector)) {
      throw Error(
        `Field selector is not valid. Please specify a string selector or a valid DOM element.`
      );
    }

    let elem;

    if (typeof fieldSelector === 'string') {
      elem = this.form!.querySelector(fieldSelector) as HTMLInputElement | null;
    } else {
      elem = fieldSelector;
    }

    if (!elem) {
      throw Error(
        `Field doesn't exist in the DOM! Please check the field selector.`
      );
    }

    if (!Array.isArray(rules) || !rules.length) {
      throw Error(
        `Rules argument should be an array and should contain at least 1 element.`
      );
    }

    rules.forEach((item) => {
      if (!('rule' in item || 'validator' in item || 'plugin' in item)) {
        throw Error(
          `Rules argument must contain at least one rule or validator property.`
        );
      }

      if (
        !item.validator &&
        !item.plugin &&
        (!item.rule || !Object.values(Rules).includes(item.rule))
      ) {
        throw Error(
          `Rule should be one of these types: ${Object.values(Rules).join(
            ', '
          )}. Provided value: ${item.rule}`
        );
      }
    });

    const key = this.setKeyByFieldSelector(fieldSelector);

    this.fields[key] = {
      elem,
      rules,
      isValid: undefined,
      config,
    };

    this.setListeners(elem);

    // if we add field after submitting the form we should validate again
    if (this.isSubmitted) {
      this.validate();
    }
    return this;
  }

  public removeField(fieldSelector: FieldSelectorType): JustValidate {
    if (typeof fieldSelector !== 'string' && !isElement(fieldSelector)) {
      throw Error(
        `Field selector is not valid. Please specify a string selector or a valid DOM element.`
      );
    }

    const key = this.getKeyByFieldSelector(fieldSelector);

    if (!key || !this.fields[key]) {
      console.error(`Field not found. Check the field selector.`);
      return this;
    }

    const type = this.getListenerType(this.fields[key].elem.type);
    this.removeListener(type, this.fields[key].elem, this.handlerChange);
    this.clearErrors();

    delete this.fields[key];
    return this;
  }

  public removeGroup(group: string): JustValidate {
    if (typeof group !== 'string') {
      throw Error(
        `Group selector is not valid. Please specify a string selector.`
      );
    }

    const key = this.getKeyByFieldSelector(group);

    if (!key || !this.groupFields[key]) {
      console.error(`Group not found. Check the group selector.`);
      return this;
    }

    this.groupFields[key].elems.forEach((elem) => {
      const type = this.getListenerType(elem.type);
      this.removeListener(type, elem, this.handlerChange);
    });

    this.clearErrors();

    delete this.groupFields[key];
    return this;
  }

  public addRequiredGroup(
    groupField: string,
    errorMessage?: string,
    config?: FieldConfigInterface,
    successMessage?: string
  ): JustValidate {
    if (typeof groupField !== 'string') {
      throw Error(
        `Group selector is not valid. Please specify a string selector.`
      );
    }

    const elem = this.form!.querySelector(groupField) as HTMLElement;

    if (!elem) {
      throw Error(
        `Group with ${groupField} selector not found! Please check the group selector.`
      );
    }

    const inputs: NodeListOf<HTMLInputElement> = elem.querySelectorAll('input');
    // get only children from this particular group (not from parent group)
    const childrenInputs = Array.from(inputs).filter((input) => {
      const parent = getClosestParent(this.groupFields, getNodeParents(input));

      if (!parent) {
        return true;
      }

      return parent[1].elems.find((elem) => elem !== input);
    });

    const key = this.setKeyByFieldSelector(groupField);

    this.groupFields[key] = {
      rules: [
        {
          rule: GroupRules.Required,
          errorMessage,
          successMessage,
        },
      ],
      groupElem: elem,
      elems: childrenInputs,
      isDirty: false,
      isValid: undefined,
      config,
    };

    inputs.forEach((input) => {
      this.setListeners(input);
    });

    return this;
  }

  getListenerType(type: string): 'change' | 'input' | 'keyup' {
    switch (type) {
      case 'checkbox':
      case 'select-one':
      case 'file':
      case 'radio': {
        return 'change';
        break;
      }

      default: {
        return 'input';
      }
    }
  }

  setListeners(elem: HTMLInputElement): void {
    const type = this.getListenerType(elem.type);
    this.removeListener(type, elem, this.handlerChange);
    this.addListener(type, elem, this.handlerChange);
  }

  clearFieldLabel(key: string): void {
    this.errorLabels[key]?.remove();
    this.successLabels[key]?.remove();
  }

  clearFieldStyle(key: string): void {
    const field = this.fields[key];

    const errorStyle =
      field.config?.errorFieldStyle || this.globalConfig.errorFieldStyle;
    Object.keys(errorStyle).forEach((key) => {
      field.elem.style[key] = '';
    });

    const successStyle =
      field.config?.successFieldStyle ||
      this.globalConfig.successFieldStyle ||
      {};
    Object.keys(successStyle).forEach((key) => {
      field.elem.style[key] = '';
    });

    field.elem.classList.remove(
      ...getClassList(
        field.config?.errorFieldCssClass || this.globalConfig.errorFieldCssClass
      ),
      ...getClassList(
        field.config?.successFieldCssClass ||
          this.globalConfig.successFieldCssClass
      )
    );
  }

  clearErrors(): void {
    Object.keys(this.errorLabels).forEach((key) =>
      this.errorLabels[key].remove()
    );
    Object.keys(this.successLabels).forEach((key) =>
      this.successLabels[key].remove()
    );

    for (const key in this.fields) {
      this.clearFieldStyle(key);
    }

    for (const key in this.groupFields) {
      const group = this.groupFields[key];

      const errorStyle =
        group.config?.errorFieldStyle || this.globalConfig.errorFieldStyle;
      Object.keys(errorStyle).forEach((key) => {
        group.elems.forEach((elem) => {
          elem.style[key] = '';
          elem.classList.remove(
            ...getClassList(
              group.config?.errorFieldCssClass ||
                this.globalConfig.errorFieldCssClass
            )
          );
        });
      });

      const successStyle =
        group.config?.successFieldStyle ||
        this.globalConfig.successFieldStyle ||
        {};
      Object.keys(successStyle).forEach((key) => {
        group.elems.forEach((elem) => {
          elem.style[key] = '';
          elem.classList.remove(
            ...getClassList(
              group.config?.successFieldCssClass ||
                this.globalConfig.successFieldCssClass
            )
          );
        });
      });
    }

    this.tooltips = [];
  }

  isTooltip(): boolean {
    return !!this.globalConfig.tooltip;
  }

  lockForm(): void {
    const elems: NodeListOf<HTMLInputElement> = this.form!.querySelectorAll(
      'input, textarea, button, select'
    );
    for (let i = 0, len = elems.length; i < len; ++i) {
      elems[i].setAttribute(
        'data-just-validate-fallback-disabled',
        elems[i].disabled ? 'true' : 'false'
      );
      elems[i].setAttribute('disabled', 'disabled');
      elems[i].style.pointerEvents = 'none';
      elems[i].style.webkitFilter = 'grayscale(100%)';
      elems[i].style.filter = 'grayscale(100%)';
    }
  }

  unlockForm(): void {
    const elems: NodeListOf<HTMLInputElement> = this.form!.querySelectorAll(
      'input, textarea, button, select'
    );
    for (let i = 0, len = elems.length; i < len; ++i) {
      if (
        elems[i].getAttribute('data-just-validate-fallback-disabled') !== 'true'
      ) {
        elems[i].removeAttribute('disabled');
      }
      elems[i].style.pointerEvents = '';
      elems[i].style.webkitFilter = '';
      elems[i].style.filter = '';
    }
  }

  renderTooltip(
    elem: HTMLElement,
    errorLabel: HTMLDivElement,
    position?: TooltipPositionType
  ): TooltipInstance {
    const { top, left, width, height } = elem.getBoundingClientRect();
    const errorLabelRect = errorLabel.getBoundingClientRect();

    const pos = position || this.globalConfig.tooltip?.position;

    switch (pos) {
      case 'left': {
        errorLabel.style.top = `${
          top + height / 2 - errorLabelRect.height / 2
        }px`;
        errorLabel.style.left = `${
          left - errorLabelRect.width - TOOLTIP_ARROW_HEIGHT
        }px`;
        break;
      }

      case 'top': {
        errorLabel.style.top = `${
          top - errorLabelRect.height - TOOLTIP_ARROW_HEIGHT
        }px`;
        errorLabel.style.left = `${
          left + width / 2 - errorLabelRect.width / 2
        }px`;
        break;
      }

      case 'right': {
        errorLabel.style.top = `${
          top + height / 2 - errorLabelRect.height / 2
        }px`;
        errorLabel.style.left = `${left + width + TOOLTIP_ARROW_HEIGHT}px`;
        break;
      }

      case 'bottom': {
        errorLabel.style.top = `${top + height + TOOLTIP_ARROW_HEIGHT}px`;
        errorLabel.style.left = `${
          left + width / 2 - errorLabelRect.width / 2
        }px`;
        break;
      }
    }

    errorLabel.dataset.direction = pos;

    const refresh = (): void => {
      this.renderTooltip(elem, errorLabel, position);
    };

    return {
      refresh,
    };
  }

  createErrorLabelElem(
    key: string,
    errorMessage: string,
    config?: FieldConfigInterface
  ): HTMLDivElement {
    const errorLabel = document.createElement('div');
    errorLabel.innerHTML = errorMessage;

    const customErrorLabelStyle = this.isTooltip()
      ? config?.errorLabelStyle
      : config?.errorLabelStyle || this.globalConfig.errorLabelStyle;

    Object.assign(errorLabel.style, customErrorLabelStyle);

    errorLabel.classList.add(
      ...getClassList(
        config?.errorLabelCssClass || this.globalConfig.errorLabelCssClass
      ),
      'just-validate-error-label'
    );

    if (this.isTooltip()) {
      errorLabel.dataset.tooltip = 'true';
    }

    if (this.globalConfig.testingMode) {
      errorLabel.dataset.testId = `error-label-${key}`;
    }

    this.errorLabels[key] = errorLabel;

    return errorLabel;
  }

  createSuccessLabelElem(
    key: string,
    successMessage?: string,
    config?: FieldConfigInterface
  ): HTMLDivElement | null {
    if (successMessage === undefined) {
      return null;
    }

    const successLabel = document.createElement('div');
    successLabel.innerHTML = successMessage;

    const customSuccessLabelStyle =
      config?.successLabelStyle || this.globalConfig.successLabelStyle;

    Object.assign(successLabel.style, customSuccessLabelStyle);

    successLabel.classList.add(
      ...getClassList(
        config?.successLabelCssClass || this.globalConfig.successLabelCssClass
      ),
      'just-validate-success-label'
    );

    if (this.globalConfig.testingMode) {
      successLabel.dataset.testId = `success-label-${key}`;
    }

    this.successLabels[key] = successLabel;

    return successLabel;
  }

  renderErrorsContainer(
    label: HTMLDivElement,
    errorsContainer?: string | null | Element
  ): boolean {
    const container = errorsContainer || this.globalConfig.errorsContainer;

    if (typeof container === 'string') {
      const elem = this.form!.querySelector(container);

      if (elem) {
        elem.appendChild(label);
        return true;
      } else {
        console.error(
          `Error container with ${container} selector not found. Errors will be rendered as usual`
        );
      }
    }

    if (container instanceof Element) {
      container.appendChild(label);
      return true;
    }

    if (container !== undefined) {
      console.error(
        `Error container not found. It should be a string or existing Element. Errors will be rendered as usual`
      );
    }

    return false;
  }

  renderGroupLabel(
    elem: HTMLElement,
    label: HTMLDivElement,
    errorsContainer?: string | null | Element,
    isSuccess?: boolean
  ): void {
    if (!isSuccess) {
      const renderedInErrorsContainer = this.renderErrorsContainer(
        label,
        errorsContainer
      );

      if (renderedInErrorsContainer) {
        return;
      }
    }

    elem.appendChild(label);
  }

  renderFieldLabel(
    elem: HTMLInputElement,
    label: HTMLDivElement,
    errorsContainer?: string | null | Element,
    isSuccess?: boolean
  ): void {
    if (!isSuccess) {
      const renderedInErrorsContainer = this.renderErrorsContainer(
        label,
        errorsContainer
      );

      if (renderedInErrorsContainer) {
        return;
      }
    }

    if (elem.type === 'checkbox' || elem.type === 'radio') {
      const labelElem = document.querySelector(
        `label[for="${elem.getAttribute('id')}"]`
      );

      if (elem.parentElement?.tagName?.toLowerCase() === 'label') {
        elem.parentElement?.parentElement?.appendChild(label);
      } else if (labelElem) {
        labelElem.parentElement?.appendChild(label);
      } else {
        elem.parentElement?.appendChild(label);
      }
    } else {
      elem.parentElement?.appendChild(label);
    }
  }

  showLabels(fields: ShowLabelsInterface, isError: boolean): void {
    Object.keys(fields).forEach((fieldName, i) => {
      const error = fields[fieldName];

      // supports only string selectors for now
      const key = this.getKeyByFieldSelector(fieldName);

      if (!key || !this.fields[key]) {
        console.error(`Field not found. Check the field selector.`);
        return;
      }

      const field = this.fields[key];

      field.isValid = !isError;
      this.clearFieldStyle(key);
      this.clearFieldLabel(key);

      this.renderFieldError(key, error);

      if (i === 0 && this.globalConfig.focusInvalidField) {
        setTimeout(() => field.elem.focus(), 0);
      }
    });
  }

  public showErrors(fields: ShowLabelsInterface): void {
    if (typeof fields !== 'object') {
      throw Error(
        '[showErrors]: Errors should be an object with key: value format'
      );
    }

    this.showLabels(fields, true);
  }

  public showSuccessLabels(fields: ShowLabelsInterface): void {
    if (typeof fields !== 'object') {
      throw Error(
        '[showSuccessLabels]: Labels should be an object with key: value format'
      );
    }

    this.showLabels(fields, false);
  }

  renderFieldError(key: string, message?: string): void {
    const field = this.fields[key];

    if (field.isValid === undefined) {
      return;
    }

    if (field.isValid) {
      // we should not show success labels if there are async rules pending
      if (!field.asyncCheckPending) {
        const successLabel = this.createSuccessLabelElem(
          key,
          message !== undefined ? message : field.successMessage!,
          field.config
        );
        if (successLabel) {
          this.renderFieldLabel(
            field.elem,
            successLabel,
            field.config?.errorsContainer,
            true
          );
        }
        field.elem.classList.add(
          ...getClassList(
            field.config?.successFieldCssClass ||
              this.globalConfig.successFieldCssClass
          )
        );
      }

      return;
    }

    this.isValid = false;

    field.elem.classList.add(
      ...getClassList(
        field.config?.errorFieldCssClass || this.globalConfig.errorFieldCssClass
      )
    );

    const errorLabel = this.createErrorLabelElem(
      key,
      message !== undefined ? message : field.errorMessage!,
      field.config
    );
    this.renderFieldLabel(
      field.elem,
      errorLabel,
      field.config?.errorsContainer
    );

    if (this.isTooltip()) {
      this.tooltips.push(
        this.renderTooltip(
          field.elem,
          errorLabel,
          field.config?.tooltip?.position
        )
      );
    }
  }

  renderGroupError(key: string): void {
    const group = this.groupFields[key];

    if (group.isValid === undefined) {
      return;
    }

    if (group.isValid) {
      group.elems.forEach((elem) => {
        Object.assign(
          elem.style,
          group.config?.successFieldStyle || this.globalConfig.successFieldStyle
        );
        elem.classList.add(
          ...getClassList(
            group.config?.successFieldCssClass ||
              this.globalConfig.successFieldCssClass
          )
        );
      });
      const successLabel = this.createSuccessLabelElem(
        key,
        group.successMessage,
        group.config
      );
      if (successLabel) {
        this.renderGroupLabel(
          group.groupElem,
          successLabel,
          group.config?.errorsContainer,
          true
        );
      }
      return;
    }

    this.isValid = false;

    group.elems.forEach((elem) => {
      Object.assign(
        elem.style,
        group.config?.errorFieldStyle || this.globalConfig.errorFieldStyle
      );
      elem.classList.add(
        ...getClassList(
          group.config?.errorFieldCssClass ||
            this.globalConfig.errorFieldCssClass
        )
      );
    });

    const errorLabel = this.createErrorLabelElem(
      key,
      group.errorMessage!,
      group.config
    );
    this.renderGroupLabel(
      group.groupElem,
      errorLabel,
      group.config?.errorsContainer
    );

    if (this.isTooltip()) {
      this.tooltips.push(
        this.renderTooltip(
          group.groupElem,
          errorLabel,
          group.config?.tooltip?.position
        )
      );
    }
  }

  renderErrors(forceRevalidation = false): void {
    if (
      !this.isSubmitted &&
      !forceRevalidation &&
      !this.globalConfig.validateBeforeSubmitting
    ) {
      return;
    }
    this.clearErrors();

    this.isValid = true;

    for (const key in this.groupFields) {
      this.renderGroupError(key);
    }

    for (const key in this.fields) {
      this.renderFieldError(key);
    }
  }

  public destroy(): void {
    this.eventListeners.forEach((event) => {
      this.removeListener(event.type, event.elem, event.func);
    });

    Object.keys(this.customStyleTags).forEach((key) => {
      this.customStyleTags[key].remove();
    });

    this.clearErrors();
    if (this.globalConfig.lockForm) {
      this.unlockForm();
    }
  }

  public refresh(): void {
    this.destroy();

    if (!this.form) {
      console.error('Cannot initialize the library! Form is not defined');
    } else {
      this.initialize(this.form, this.globalConfig);

      Object.keys(this.fields).forEach((key) => {
        const fieldSelector = this.getFieldSelectorByKey(key);

        if (fieldSelector) {
          this.addField(
            fieldSelector,
            [...this.fields[key].rules],
            this.fields[key].config
          );
        }
      });
    }
  }

  public setCurrentLocale(locale?: string): void {
    if (typeof locale !== 'string' && locale !== undefined) {
      console.error('Current locale should be a string');
      return;
    }

    this.currentLocale = locale!;

    if (this.isSubmitted) {
      this.validate();
    }
  }

  public onSuccess(callback: (ev?: Event) => void): JustValidate {
    this.onSuccessCallback = callback;
    return this;
  }

  public onFail(
    callback: (fields: FieldsInterface, groups: GroupFieldsInterface) => void
  ): JustValidate {
    this.onFailCallback = callback;
    return this;
  }
}

export default JustValidate;
export * from './modules/interfaces';
