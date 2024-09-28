import { Component } from "./base/Component";
import { IProduct } from "../types";
import { IEvents } from "./base/events";

/**
 * Класс предназначен для отбражения карточки товара.
 */
export class Card  extends Component<IProduct>{
  protected events: IEvents;

  protected cardId: string;
  protected cardDescription: HTMLParagraphElement;
  protected cardImage: HTMLImageElement;
  protected cardTitle: HTMLHeadingElement;
  protected cardCategory: HTMLSpanElement;
  protected cardPrice: HTMLSpanElement;
  protected cardIndex: HTMLSpanElement;
  
  protected addButton: HTMLButtonElement;
  protected removeButton: HTMLButtonElement;
 
  constructor(protected container: HTMLTemplateElement, events: IEvents) {
    super(container);
    this.events = events;
    
    // описание товара
    this.cardDescription = this.container.querySelector('.card__text');
    // картинка товара
    this.cardImage = this.container.querySelector('.card__image');
    // название товара
    this.cardTitle = this.container.querySelector('.card__title');
    // категория товара
    this.cardCategory = this.container.querySelector('.card__category');
    // цена товара
    this.cardPrice = this.container.querySelector('.card__price');
    // номер товара в корзине
    this.cardIndex = this.container.querySelector('.basket__item-index');

    // кнопка добавления товара в корзинк
    this.addButton = this.container.querySelector('.button');
    // кнопка удаления товара из корзины
    this.removeButton = this.container.querySelector('.basket__item-delete');

    if(this.addButton) {
      // если темплейт просмотра товара, имеется кнопка купить, устанавливаем на неё слушатель
      this.addButton.addEventListener('click', () => this.events.emit('bids:add', { id: this.getId() }))
    } else if (this.removeButton) {
      // если темплейт карточки в корзине, имеется кнопка удалить товар из корзины, устанавливаем на неё слушатель
      this.removeButton.addEventListener('click', () => this.events.emit('bids:remove', { id: this.getId() }))
    } else {
      // если нет кнопок купить и удалить, значит темплейт карточки в каталоге, устанавливаем слушатель на всю карточку
      this.container.addEventListener('click', () =>  this.events.emit('card:select', { id: this.getId() }))
    }
  }

  /**
  * Сеттер `id`\
  * Устанавливает id карточки такой же как у товара.
  */
  set id (id: string) {
    this.cardId = id;
  }

  /**
  * Сеттер `description`\
  * Устанавливает описание товара.\
  * Так как в темплейте может не быть описания, сначала проверяет.
  */
  set description (description: string) {
    if (this.cardDescription) this.cardDescription.textContent = description;  
  }

  /**
  * Сеттер `image`\
  * Устанавливает адрес картинки.\
  * Так как в темплейте может не быть картинки, сначала проверяет.
  */
  set image (image: string) {
    if (this.cardImage) this.cardImage.src = image;
  }

  /**
  * Сеттер `title`\
  * Устанавливает название товара.\
  * Если в темплейте есть картинка, в описание картинки тоже устанавливает название товара.
  */
  set title (title: string) {
    this.cardTitle.textContent = title;
    if (this.cardImage) this.cardImage.alt = title;
  }

  /**
  * Сеттер `category`\
  * Устанавливает категорию товара.\
  * Так как в темплейте может не быть категории, сначала проверяет.\
  * У каждой категории свой цвет, поэтому через `switch case` устанавливает нужный класс для элемента.
  */
  set category (category: string) {
    if(this.cardCategory) {
      this.cardCategory.textContent = category;
      switch (category) {
        case 'софт-скил':
          this.cardCategory.classList.add('card__category_soft');
          break;
        case 'хард-скил':
          this.cardCategory.classList.add('card__category_hard');
          break;
        case 'другое':
          this.cardCategory.classList.add('card__category_other');
          break;
          case 'дополнительное':
          this.cardCategory.classList.add('card__category_additional');
          break;
        case 'кнопка':
          this.cardCategory.classList.add('card__category_button');
          break;
        }
      }
    }

  /**
  * Сеттер `price`\
  * Устанавливает цену товара.\
  * Чтобы не было нуля в цене, проверяет что товар не бесценный.
  */
  set price (price: number | null) {
    if (price === null) {
      this.cardPrice.textContent = 'Бесценно';
    } else {
      this.cardPrice.textContent = `${price} синапсов`;
    }
  }

  /**
  * Метод `lockedButton`\
  * Делает кнопку купить доступной или недоступной.
  */
  lockedButton (value: boolean) {
    if (value) {
      this.addButton.disabled = true;
    } else {
      this.addButton.disabled = false;
    }
  }

  /**
  * Метод `setIndex`\
  * Устанавливает номер карточки.\
  *  Необходим, когда карточка отображается в корзине.
  */
  setIndex (index: number) {
    this.cardIndex.textContent = index.toString();
  }

  /**
  * Метод `getId`\
  * Возвращает id карточки.
  */
  getId() {
    return this.cardId;
  }
}