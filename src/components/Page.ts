import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { IPage } from "../types";

/**
 * Управляет отображением всей страницы.
 */
export class Page extends Component<IPage> {
  protected _counter: HTMLSpanElement;
  protected _catalog: HTMLElement;
  protected basket: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    // количество товаров в корзине
    this._counter = container.querySelector('.header__basket-counter');
    // контейнер для списка товаров
    this._catalog = container.querySelector('.gallery');
    // кнопка корзины
    this.basket = container.querySelector('.header__basket');
    // слушатель на кнопку корзины
    this.basket.addEventListener('click', () => { this.events.emit('bids:render') });
  }

  /**
  * Сеттер `counter`\
  * Устанавливает количество товаров в корзине.
  */
  set counter(value: number) {
      this._counter.textContent = value.toString();
  }

  /**
  * Сеттер `catalog`\
  * Принимает массив HTML элементов карточек товара.\
  * Принимаемый элементы из массива становятся дочерним, для элемента, который находится в свойстве `_catalog`
  */
  set catalog(items: HTMLElement[]) {
      this._catalog.replaceChildren(...items);
  }

  /**
  * Метод `locked`\
  * Блокирует или разблокирует прокрутку страницы.\
  * Это осоществляется при помощи установки или удаления класса на странице.
  */
  locked(value: boolean) {
      if (value) {
          this.container.classList.add('page_locked');
      } else {
          this.container.classList.remove('page_locked');
      }
  }
}