import { IOrderData, IProduct, TOrderDelivery, TOrderContact } from "../types";
import { IEvents } from "./base/events";

/**
 * Класс отвечает за хранение и работу с товарами, которые были добавлены в корзину,\
 * а также данными пользователя, необходимыми для оформления заказа
 */
export class OrderData implements IOrderData {
  protected payment: string;
  protected email: string;
  protected phone: string;
  protected address: string;
  protected items: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    //инициализируем массив товаров, иначе будет undefined, с которым не смогут работать методы массива
    this.items = [];
    
  }

  /**
  * `Метод addProduct`\
  * Принимает объект товара, который добавляют в корзину.\
  * Методом `push` принимаемый объект добавляется в массив товаров в корзине.\
  * Генерирует событие `order:changed`
  */
  addProduct(item: IProduct) {
    this.items.push(item);
    this.events.emit('order:changed');
  }

  /**
  * `Метод deleteProduct`\
  * Принимает `id` товара, который нужно удалить из корзины.\
  * Метод `filter` преобразует существующий массив товаров в новый, не содержащий объекта с переданным id.\
  * Генерирует событие `order:changed`
  */
  deleteProduct(id: string) {
    this.items = this.items.filter( item => item.id !== id);
    this.events.emit('order:changed');
  }

  /**
  * `Метод getProducts`\
  * Возвращает массив объектов товаров в корзине.
  */
  getProducts() {
    return this.items;
  }

  /**
  * `Метод getProduct`\
  * Принимает `id` товара.\
  * Возвращает объект товара, если находит такой товар.
  */
  getProduct(id: string) {
    return this.items.find(item => item.id === id)
  }

  /**
  * `Метод setDelivery`\
  * Принимает объект типа `TOrderDelivery` и устанавливает тип оплаты и адрес, соответствующим полям.
  */
  setDelivery(delivery: TOrderDelivery) {
    this.payment = delivery.payment;
    this.address = delivery.address;
  }

  /**
  * `Метод setContact`\
  * Принимает объект типа `TOrderContact` и устанавливает email и телефон, соответствующим полям.
  */
  setContact(contact: TOrderContact) {
    this.email = contact.email;
    this.phone = contact.phone;
  }

  /**
  * `Метод getTotal`\
  * Возвращает общую стоимость товаров в корзине.\
  * Бесценный товар не включается в стоимость.
  */
  getTotal() {
    let count: number = 0;
    this.items.forEach(item => {
      if(item.price) count = count + item.price
    })
    return count;
  } 

  /**
  * `Метод getCount`\
  * Возвращает количество товаров в корзине.
  */
  getCount() {
    return this.items.length;
  }

  /**
  * `Метод getOrder`\
  * Возвращает объект типа `IOrder`, в таком виде заказ передаётся на сервер для оформления.\
  * Данные покупателя берутся из соответствующих полей,\
  * общая стоимость получается посредством метода `getTotal`,\
  * методом `forEach` массив товаров преобразуется в массив `id` товаров,\
  * если имеется бесценный товар, он не включается в массив `id`
  */
  getOrder() {
    const masId: string[] = [];
    this.items.forEach(item => {
      if(item.price !== null) {
        masId.push(item.id)
      }
    })
    return { 
      payment: this.payment, 
      email: this.email, 
      phone: this.phone, 
      address: this.address, 
      total: this.getTotal(),
      items: masId,
    }
  }

  /**
  * `Метод clearOrder`\
  * Очищает заказ, уставливая в соответсвующие поля пустые строки и пустой массив.\
  * Генерирует событие `order:changed`
  */
  clearOrder() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.items = [];
    this.events.emit('order:changed');
  }
}