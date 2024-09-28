import { IOrder, TOrderAnswer, TProductAnswer, IAppApi } from "../types";
import { Api } from "./base/api";

/**
* `AppApi` расширяет класс `Api` и предоставляет методы реализующие взаимодействие с бэкендом сервиса.
*/
export class AppApi extends Api implements IAppApi {
  readonly cdn: string;

  constructor(baseUrl: string, cdn: string) {
    super(baseUrl);
    this.cdn = cdn;
  }

  /**
  * Mетод `getProductList`\
  * Делает запрос на сервер для получения объекта с товарами.\
  * Из ответа сервера берёт только массив объектов товаров.\
  * В свойство `image` каждого товара, добавляет правильный адрес cdn сервера.\
  * И возвращает полученный массив объектов с товарами.
  */
  getProductList() {
    return this.get(`/product`).then((data: TProductAnswer)  => 
      data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
    );
  }

  /**
  * Mетод `postOrder`\
  * Отправляет на сервер объект заказа.\
  * Возвращает ответ сервера.
  */
  postOrder(order: IOrder) {
    return this.post(`/order`, order).then((data: TOrderAnswer) => data);
  }
}