import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import ProductService from "../services/product.service.ts";
import { Status } from "../deps.ts";

class ProductController {
  /**
   * Create Product function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async create({
    request,
    response,
  }: RouterContext<string>): Promise<void> {
    const body = request.body();
    const { name, code, isDisabled, cost, price, organization } =
      await body.value;
    log.debug("Creating product");
    response.body = await ProductService.createOne({
      name,
      code,
      organization,
      cost,
      price,
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
    response.status = Status.Created;
  }

  /**
   * Get single product function
   * @param response
   * @returns Promise<void>
   */
  public static async fetch({
    response,
  }: RouterContext<string>): Promise<void> {
    log.debug("Getting products list");
    response.body = await ProductService.getAll();
  }

  /**
   * Get my product document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext<string>): void {
    log.debug("Getting me data");
    response.body = state;
  }

  /**
   * Get all products function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async show({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Getting product");
    response.body = await ProductService.getOne(id as string);
  }

  /**
   * Update product function
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
    log.debug("Updating product");
    await ProductService.updateOne(id as string, {
      name,
      isDisabled,
    });
    response.body = await ProductService.getOne(id as string);
  }

  /**
   * Delete product function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async remove({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Removing product");
    const deleteCount: number | Error = await ProductService.removeOne(
      id as string
    );
    response.body = { deleted: deleteCount };
  }
}

export default ProductController;
