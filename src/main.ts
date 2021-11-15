import {
  isEmail,
  isEmpty,
  isMaxLength,
  isMaxNumber,
  isMinLength,
  isMinNumber,
  isNumber,
  isPassword,
  isStrongPassword,
} from './validationUtils';
import {
  FieldConfigInterface,
  FieldRuleInterface,
  GlobalConfigInterface,
  Rules,
  StateValueInterface,
  StateValuesInterface,
} from './interfaces';
import { getDefaultMessage } from './messages';

const defaultGlobalConfig: GlobalConfigInterface = {
  errorFieldStyle: {
    color: '#b81111',
    border: '1px solid #B81111',
  },
  errorFieldCssClass: 'js-validate-error-field',
  errorLabelStyle: {
    color: '#b81111',
  },
  errorLabelCssClass: 'js-validate-error-label',
};

class JustValidate {
  $form: Element | null = null;
  fields: StateValuesInterface = {};
  errors: {
    [key: string]: {
      message?: string;
    };
  } = {};
  isValid = false;
  globalConfig: GlobalConfigInterface;
  $errorLabels: HTMLDivElement[] = [];

  constructor(
    form: string | Element,
    globalConfig?: Partial<GlobalConfigInterface>
  ) {
    if (typeof form === 'string') {
      const elem = document.querySelector(form);

      if (!elem) {
        throw Error(
          `Form with ${form} selector not found! Please check the form selector`
        );
      }
      this.setForm(elem);
    } else if (form instanceof Element) {
      this.setForm(form);
    } else {
      throw Error(
        `Form selector is not valid. Please specify a string selector or a DOM element.`
      );
    }

    this.globalConfig = { ...defaultGlobalConfig, ...globalConfig };
  }

  getErrorMessage(fieldRule: FieldRuleInterface) {
    return (
      fieldRule.errorMessage ||
      getDefaultMessage(fieldRule.rule, fieldRule.value)
    );
  }

  setInvalid(field: string, fieldRule: FieldRuleInterface) {
    this.fields[field].isValid = false;
    this.fields[field].errorMessage = this.getErrorMessage(fieldRule);
  }

  setValid(field: string) {
    this.fields[field].isValid = true;
  }

  validateRule(field: string, elem: Element, fieldRule: FieldRuleInterface) {
    const ruleValue = fieldRule.value;
    switch (fieldRule.rule) {
      case Rules.Required: {
        if (isEmpty(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.Email: {
        if (!isEmail(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.MaxLength: {
        if (!ruleValue) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        if (isMaxLength(elem.value, ruleValue)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.MinLength: {
        if (!ruleValue) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        if (isMinLength(elem.value, ruleValue)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.Password: {
        if (!isPassword(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.StrongPassword: {
        if (!isStrongPassword(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.Number: {
        if (!isNumber(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.MaxNumber: {
        if (!ruleValue) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        const numValue = +ruleValue;

        if (Number.isNaN(numValue)) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field should be a number. Validation will be skipped for this rule.`
          );
          return;
        }

        const num = +elem.value;

        if (Number.isNaN(num) || isMaxNumber(num, numValue)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.MinNumber: {
        if (!ruleValue) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        const numValue = +ruleValue;

        if (Number.isNaN(numValue)) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field should be a number. Validation will be skipped for this rule.`
          );
          return;
        }

        const num = +elem.value;

        if (Number.isNaN(num) || isMinNumber(num, numValue)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }
        break;
      }

      case Rules.CustomRegexp: {
        if (!ruleValue) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        if (typeof ruleValue !== 'string') {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] field should be a string. Validation will be skipped for this rule.`
          );
          return;
        }

        let regexp;

        try {
          regexp = new RegExp(ruleValue);
        } catch (e) {
          console.error(
            `Value for ${fieldRule.rule} rule for [${field}] should be a valid regexp. Validation will be skipped for this rule.`
          );
          break;
        }

        if (!regexp.test(elem.value)) {
          this.setInvalid(field, fieldRule);
        } else {
          this.setValid(field);
        }

        break;
      }

      default: {
        if (!fieldRule.validator) {
          console.error(
            `Validator for custom rule for [${field}] field is not defined. Validation will be skipped for this rule.`
          );
          return;
        }

        if (typeof fieldRule.validator !== 'function') {
          console.error(
            `Validator for custom rule for [${field}] field should be a function. Validation will be skipped for this rule.`
          );
          return;
        }

        const result = fieldRule.validator(field, elem.value);

        if (typeof result !== 'boolean') {
          console.error(
            `Validator return value for [${field}] field should be boolean. It will be cast to boolean.`
          );
        }

        if (!result) {
          this.setInvalid(field, fieldRule);
          break;
        } else {
          this.setValid(field);
        }
      }
    }
  }

  validateField(fieldName: string, field: StateValueInterface) {
    field.rules.forEach((rule) => {
      this.validateRule(fieldName, field.elem, rule);
    });
  }

  validate() {
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];
      this.validateField(fieldName, field);
    });
    this.renderErrors();
  }

  setForm(form: Element) {
    this.$form = form;
    this.$form.setAttribute('novalidate', 'novalidate');
    this.$form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      this.validate();
    });
  }

  handlerKeyup = (ev: Event) => {
    const { value } = ev.target;

    for (const fieldName in this.fields) {
      const field = this.fields[fieldName];

      if (field.elem === ev.target) {
        this.validateField(fieldName, field);
        this.renderErrors();
        break;
      }
    }
  };

  addListener(elem: Element) {
    elem.addEventListener('change', this.handlerKeyup);
  }

  removeListener(elem: Element) {
    elem.removeEventListener('change', this.handlerKeyup);
  }

  addField(
    field: string,
    rules: FieldRuleInterface[],
    config?: FieldConfigInterface
  ): JustValidate {
    if (typeof field !== 'string') {
      throw Error(
        `Field selector is not valid. Please specify a string selector.`
      );
    }

    const elem = document.querySelector(field);

    if (!elem) {
      throw Error(
        `Field with ${field} selector not found! Please check the field selector.`
      );
    }

    if (!Array.isArray(rules) || !rules.length) {
      throw Error(
        `Rules argument for the field [${field}] should be an array and should contain at least 1 element.`
      );
    }

    rules.forEach((item) => {
      if (!('rule' in item || 'validator' in item)) {
        throw Error(
          `Rules argument for the field [${field}] must contain at least one rule or validator property.`
        );
      }
    });

    this.fields[field] = {
      elem,
      rules,
      value: '',
      isDirty: false,
      isValid: undefined,
      config,
    };

    this.addListener(elem);

    return this;
  }

  removeField(field: string): JustValidate {
    if (typeof field !== 'string') {
      throw Error(
        `Field selector is not valid. Please specify a string selector.`
      );
    }

    if (!(field in this.fields)) {
      console.warn(`There is no [${field}] field.`);
      return this;
    }

    delete this.fields[field];
    return this;
  }

  clearErrors() {
    this.$errorLabels.forEach((item) => item.remove());

    for (const fieldName in this.fields) {
      const field = this.fields[fieldName];

      if (!field.isValid) {
        continue;
      }

      const style =
        field.config?.errorFieldStyle || this.globalConfig.errorFieldStyle;

      Object.keys(style).forEach((key) => {
        field.elem.style[key] = '';
      });
    }
  }

  lockForm() {
    const $elems = this.$form!.querySelectorAll(
      'input, textarea, button, select'
    );
    for (let i = 0, len = $elems.length; i < len; ++i) {
      $elems[i].setAttribute('disabled', 'disabled');
      $elems[i].style.pointerEvents = 'none';
      $elems[i].style.webitFilter = 'grayscale(100%)';
      $elems[i].style.filter = 'grayscale(100%)';
    }
  }

  unlockForm() {
    const $elems = this.$form!.querySelectorAll(
      'input, textarea, button, select'
    );
    for (let i = 0, len = $elems.length; i < len; ++i) {
      $elems[i].removeAttribute('disabled');
      $elems[i].style.pointerEvents = '';
      $elems[i].style.webitFilter = '';
      $elems[i].style.filter = '';
    }
  }

  renderErrors() {
    this.clearErrors();
    this.unlockForm();

    this.isValid = false;
    // if (Object.keys(this.errors).length === 0) {
    //   this.isValid = true;
    //   return;
    // }

    for (const fieldName in this.fields) {
      const field = this.fields[fieldName];

      if (field.isValid) {
        continue;
      }

      Object.assign(
        field.elem.style,
        field.config?.errorFieldStyle || this.globalConfig.errorFieldStyle
      );

      console.log(field.elem, this.globalConfig);

      field.elem.classList.add(
        field.config?.errorFieldCssClass || this.globalConfig.errorFieldCssClass
      );

      const $errorLabel = document.createElement('div');
      $errorLabel.innerHTML = field.errorMessage!;

      Object.assign(
        $errorLabel.style,
        field.config?.errorLabelStyle || this.globalConfig.errorLabelStyle
      );

      $errorLabel.classList.add(
        field.config?.errorLabelCssClass || this.globalConfig.errorLabelCssClass
      );

      this.$errorLabels.push($errorLabel);

      if (field.elem.type === 'checkbox' || field.elem.type === 'radio') {
        const $label = document.querySelector(
          `label[for="${field.elem.getAttribute('id')}"]`
        );

        if (field.elem.parentNode.tagName.toLowerCase() === 'label') {
          field.elem.parentNode.parentNode.insertBefore($errorLabel, null);
        } else if ($label) {
          $label.parentNode.insertBefore($errorLabel, $label.nextSibling);
        } else {
          field.elem.parentNode.insertBefore(
            $errorLabel,
            field.elem.nextSibling
          );
        }
      } else {
        field.elem.parentNode.insertBefore($errorLabel, field.elem.nextSibling);
      }
    }

    // if (!this.tooltipSelectorWrap.length) {
    //   return;
    // }
    //
    // this.state.tooltipsTimer = setTimeout(() => {
    //   this.hideTooltips();
    // }, this.tooltipFadeOutTime);
  }
}

export default JustValidate;
