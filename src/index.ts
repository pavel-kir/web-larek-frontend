import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { ProductsData } from "./components/ProductsData";
import { OrderData } from "./components/OrderData";
import { Page } from "./components/Page";
import { Modal } from "./components/common/Modal";
import { Card } from "./components/Card";
import { cloneTemplate } from "./utils/utils";
import { IId, TOrderDelivery, TOrderContact, TOrderAnswer} from "./types";
import { Basket } from "./components/Basket";
import { Order } from "./components/Order";
import { Contacts } from "./components/Contacts";
import { Success } from "./components/Success";

//                *Необходимые элементы разметки*

// Карточка в списке товаров
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
// Карточка в модальном окне
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
// Карточка в корзине
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
// Корзина
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
// Окно выбора оплаты и адреса
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
// Окно ввода email и телефона
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
// Окно Успешного офрмления
const successTemplate: HTMLTemplateElement = document.querySelector('#success');
// Модальное окно
const modalContainer: HTMLElement = document.querySelector('#modal-container');


//                *Объекты, используемые во всём приложении*

// Брокер событий
const events = new EventEmitter();
// Api для взаимодействия с сервером
const appApi = new AppApi(API_URL, CDN_URL);
// Модель данных - список товаров
const productsData = new ProductsData(events);
// Модель данных - заказ и корзина
const orderData = new OrderData(events);
// Контейнер всей страницы
const page = new Page(document.body, events);
// Контейнер модального окна
const modal = new Modal(modalContainer, events);


//                *Основной код*

// Получаем список продуктов с сервера
appApi.getProductList()
  .then((data) => productsData.products = data)
  .catch(err => console.error(err));

// Когда список продуктов получен с сервера и сохранён в модели отображаем его на странице
events.on('products:changed', () => {
  const cardArray = productsData.products.map(item => {
    const cardInstant = new Card(cloneTemplate(cardTemplate), events); 
    return cardInstant.render(item);
  });
  page.render({catalog: cardArray});
})

// Когда нажали на карточку товара, открываем её в модальном окне
events.on ('card:select',  (item: IId) => {
  const cardInstant = new Card(cloneTemplate(cardPreviewTemplate), events);
  if (orderData.getProduct(item.id)) cardInstant.lockedButton(true)
  modal.render({content: cardInstant.render(productsData.getProduct(item.id))});
})

// Добавляем товар в корзину  и закрываем модальное окно
events.on ('bids:add', (item: IId) => {
  orderData.addProduct(productsData.getProduct(item.id));
  modal.close();
})

// Отображаем корзину, когда открывается окно корзины или меняется список товаров в корзине 
events.on ('bids:render', () => {
  let count: number = 1;
  const basket = new Basket(cloneTemplate(basketTemplate), events);
  const basketArray = orderData.getProducts().map(item => {
    const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
    cardInstant.setIndex(count);
    count++;
    return cardInstant.render(item);
  });

  modal.render({content: basket.render({ list: basketArray , price: orderData.getTotal() }) });
})

// Удаляем товар из корзины
events.on ('bids:remove', (item: IId) => {
  orderData.deleteProduct(item.id);
  events.emit('bids:render');
})

// Когда меняется количество товаров в корзине, на главной странице обновляем число товаров в корзине  
events.on('order:changed', () => {
  page.counter = orderData.getCount();
});

// Отображаем окно выбора оплаты и адреса
events.on ('order:render', () => {
  const cardInstant = new Order(cloneTemplate(orderTemplate), events);
  modal.render({content: cardInstant.render()});
})

// Отображаем окно ввода email и телефона
events.on('contacts:render', (data: TOrderDelivery) => {
  orderData.setDelivery(data);
  const cardInstant = new Contacts(cloneTemplate(contactsTemplate), events);
  modal.render({content: cardInstant.render()});
})

// Отправляем заказ на сервер, после получения ответа открываем окно успешного оформления
events.on('success:render', (data: TOrderContact) => {
  orderData.setContact(data);
  console.log(orderData.getOrder());
  appApi.postOrder(orderData.getOrder())
  .then((data: TOrderAnswer) => {
    orderData.clearOrder();
     const cardInstant = new Success(cloneTemplate(successTemplate), events);
      modal.render({content: cardInstant.render( {total: data.total} )});
  })
  .catch(err => console.error(err));
})

// Закрываем окно успешного оформления заказа
events.on('success:close', () => modal.close());

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked(true);
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked(false);
});