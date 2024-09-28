import { Component } from "./base/Component";
import { IEvents } from "./base/events";

/**
 * Класс отвечает за отбражение данных в окне оформления заказа, где пользователь вводит электронную почту и телефон.
 */
export class Contacts  extends Component<null> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected fotmError: HTMLSpanElement;
  protected email: string;
  protected phone: string;
  protected events: IEvents;

  
  constructor(protected container: HTMLTemplateElement, events: IEvents) {
    super(container);
    this.events = events;

    // поле ввода электронной почты
    this.inputEmail = this.container.querySelector('input[name="email"]');
    // поле ввода телефона
    this.inputPhone = this.container.querySelector('input[name="phone"]');
    // кнопка `Оплатить`
    this.submitButton = this.container.querySelector('.button');
    // элемент куда выводится подсказка ввода
    this.fotmError = this.container.querySelector('.form__errors');
    
    // слушатель на поле ввода электронной почты
    this.inputEmail.addEventListener('input', () => this.checkButton());
    // слушатель на поле ввода телефона
    this.inputPhone.addEventListener('input', () => this.checkButton());
    // слушатель на кнопку `Оплатить`
    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.email = this.inputEmail.value;
      this.phone = this.inputPhone.value;
      this.events.emit('success:render', {email: this.email, phone: this.phone});
    })
  }

  /** 
  * Метод `checkButton`\
  * Управляет активностью кнопки `Оплатить` и выводом подсказки.\
  * Чтобы кнопка стала активна, должены быть указаны email и телефон.\
  * Если условие не выполнено, кнопка становится неактивной и появляется подсказка
  */
  checkButton() {
    if(this.inputEmail.value && this.inputPhone.value) { 
      this.submitButton.disabled = false;
      this.fotmError.textContent = '';
    } else {
      this.submitButton.disabled = true;
      this.fotmError.textContent = 'Укажите электронную почту и телефон.'
    } 
  }
}