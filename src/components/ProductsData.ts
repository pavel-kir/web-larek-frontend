import { IProductsData, IProduct } from "../types";
import { IEvents } from "./base/events";

/**
* Класс отвечает за хранение и работу со списком товаров.
*/
export class ProductsData implements IProductsData {
  protected _products: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
  * Сеттер `products`\
  * Принимает массив объектов с товарами и присваивает его свойству `_products`.\
  * Генерирует событие `products:changed`
  */
  set products(products: IProduct[]) {
    this._products = products;
    this.events.emit('products:changed');
  }

  /**
  * 
  * Геттер `products`\
  * Возвращает массив объектов с товарами.
  */
  get products() {
    return this._products;
  }

  /** 
  * Метод `getProduct`\
  * Принимает id товара.\
  * Если есть товар с таким id, возвращает объект этого товара, иначе undefined
  */
  getProduct(id: string) {
    return this._products.find(item => item.id === id)
  }
}