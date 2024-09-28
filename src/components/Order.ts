import { Component } from "./base/Component";
import { IEvents } from "./base/events";

/**
 * Класс отвечает за отбражение данных в окне оформления заказа, где пользователь выбирает способ оплаты и вводит адрес доставки.
 */
export class Order  extends Component<null> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected fotmError: HTMLSpanElement;
  protected payment: string;
  protected address: string;
  protected events: IEvents;

  
  constructor(protected container: HTMLTemplateElement, events: IEvents) {
    super(container);
    this.events = events;

    // кнопка `Онлайн`
    this.cardButton = this.container.querySelector('button[name="card"]');
    // кнопка `При получении`
    this.cashButton = this.container.querySelector('button[name="cash"]');
    // поле ввода адреса
    this.inputAddress = this.container.querySelector('input[name="address"]');
    // кнопка `Далее`
    this.submitButton = this.container.querySelector('.order__button');
    // элемент куда выводится подсказка ввода
    this.fotmError = this.container.querySelector('.form__errors');
    
    // слушатель на кнопку `Онлайн`
    this.cardButton.addEventListener('click', () => {this.setPayment('card')});
    // слушатель на кнопку `При получении`
    this.cashButton.addEventListener('click', () => {this.setPayment('cash')});
    // слушатель на поле ввода
    this.inputAddress.addEventListener('input', () => {this.checkButton()});
    // слушатель на кнопка `Далее`
    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.address = this.inputAddress.value;
      this.events.emit('contacts:render', {payment: this.payment, address: this.address});
    })
  }

  /** 
  * Метод `checkButton`\
  * Управляет активностью кнопки `Далее` и выводом подсказки.\
  * Чтобы кнопка стала активна, должен быть выбран способ оплаты и введён адрес.\
  * Если условие не выполнено, кнопка становится неактивной и появляется подсказка
  */
  checkButton() {
    if(this.payment && this.inputAddress.value) { 
      this.submitButton.disabled = false;
      this.fotmError.textContent = '';
    } else {
      this.submitButton.disabled = true;
      this.fotmError.textContent = 'Укажите способ оплаты и адрес.'
    } 
  }

  /** 
  * Метод `setPayment`\
  * Устанавливает метод оплаты и управляет выделением выбранной кнопки.
  */
  setPayment(type: string) {
    if (type === 'card') {
      this.payment = 'card';
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else {
      this.payment = 'cash';
      this.cardButton.classList.remove('button_alt-active');
      this.cashButton.classList.add('button_alt-active');
    }
    this.checkButton();
  }
}