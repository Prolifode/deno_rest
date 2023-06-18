import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import ItemService from "../services/item.service.ts";
import { Status } from "../deps.ts";

class ItemController {
  /**
   * Create Item function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async create({
    request,
    response,
  }: RouterContext<string>): Promise<void> {
    const body = request.body();
    const { name, code, isDisabled } = await body.value;
    log.debug("Creating item");
    response.body = await ItemService.createOne({
      name,
      code,
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
    response.status = Status.Created;
  }

  /**
   * Get single item function
   * @param response
   * @returns Promise<void>
   */
  public static async fetch({
    response,
  }: RouterContext<string>): Promise<void> {
    log.debug("Getting items list");
    response.body = await ItemService.getAll();
  }

  /**
   * Get my item document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext<string>): void {
    log.debug("Getting me data");
    response.body = state;
  }

  /**
   * Get all items function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async show({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Getting item");
    response.body = await ItemService.getOne(id as string);
  }

  /**
   * Update item function
   * @param params
   * @param request
   * @param response
   * @param state
   * @returns Promise<void>
   */
  public static async update({
    params,
    request,
    response,
  }: RouterContext<string>): Promise<void | Error> {
    const { id } = params;
    const body = request.body();
    const { name, isDisabled } = await body.value;
    log.debug("Updating item");
    await ItemService.updateOne(id as string, {
      name,
      isDisabled,
    });
    response.body = await ItemService.getOne(id as string);
  }

  /**
   * Delete item function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async remove({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Removing item");
    const deleteCount: number | Error = await ItemService.removeOne(
      id as string
    );
    response.body = { deleted: deleteCount };
  }
}

export default ItemController;
