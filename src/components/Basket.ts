import { Component } from "./base/Component";
import { IBasket } from "../types";
import { IEvents } from "./base/events";

/**
 * Класс предназначен для отображения корзины.
 */
export class Basket  extends Component<IBasket>{
  protected _list: HTMLElement;
  protected _price: HTMLSpanElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;
  
  constructor(protected container: HTMLTemplateElement, events: IEvents) {
    super(container);
    this.events = events;

    // контейнер для списка карточек товаров в корзине
    this._list = this.container.querySelector('.basket__list');
    // стоимость заказа
    this._price = this.container.querySelector('.basket__price');
    //кнопка Оформить
    this.button = this.container.querySelector('.basket__button');

    // слушатель на кнопку оформить
    this.button.addEventListener('click', () => this.events.emit('order:render'));
  }

  /**
  * Сеттер `price`\
  * Устанавливает стоимость заказа.\
  * Если она нулевая, блокирует кнопку оформить.
  */
  set price (price: number) {
    this._price.textContent = `${price} синапсов`;
    if(!price) this.button.disabled = true;
  }

  /**
  * Сеттер `list`\
  * Принимает массив HTML элементов карточек товаров в корзине.\
  * Принимаемый элементы из массива становятся дочерним, для элемента, который находится в свойстве `_list`
  */
  set list (items: HTMLElement[]) {
    this._list.replaceChildren(...items); 
  }
}