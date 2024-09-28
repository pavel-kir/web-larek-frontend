import { Component } from "./base/Component";
import { ISuccess } from "../types";
import { IEvents } from "./base/events";

/**
 * Класс отвечает за окно успешного оформления заказа.
 */
export class Success  extends Component<ISuccess> {
  protected closeButton: HTMLButtonElement;
  protected checkForm: HTMLParagraphElement;
  protected events: IEvents;

  
  constructor(protected container: HTMLTemplateElement, events: IEvents) {
    super(container);
    this.events = events;

    // элемент отображающий стоимость заказа
    this.checkForm = this.container.querySelector('.order-success__description');
    // кнопка `За новыми покупками`
    this.closeButton = this.container.querySelector('.button');
    
    // слушатель на кнопку `За новыми покупками`
    this.closeButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.events.emit('success:close');
    })
  }

  /** 
  * Сеттер `total`\
  * Устанавливает стоимость заказа.
  */
  set total(total: number) {
    this.checkForm.textContent = `Списано ${total} синапсов`;
  }
}