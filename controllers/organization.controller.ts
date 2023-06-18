import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import OrganizationService from "../services/organization.service.ts";
import { Status } from "../deps.ts";

class OrganizationController {
  /**
   * Create Organization function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async create({
    request,
    response,
  }: RouterContext<string>): Promise<void> {
    const body = request.body();
    const { name, isDisabled } = await body.value;
    log.debug("Creating organization");
    response.body = await OrganizationService.createOne({
      name,
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
    response.status = Status.Created;
  }

  /**
   * Get single organization function
   * @param response
   * @returns Promise<void>
   */
  public static async fetch({
    response,
  }: RouterContext<string>): Promise<void> {
    log.debug("Getting organizations list");
    response.body = await OrganizationService.getAll();
  }

  /**
   * Get my organization document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext<string>): void {
    log.debug("Getting me data");
    response.body = state;
  }

  /**
   * Get all organizations function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async show({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Getting organization");
    response.body = await OrganizationService.getOne(id as string);
  }

  /**
   * Update organization function
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
    log.debug("Updating organization");
    await OrganizationService.updateOne(id as string, {
      name,
      isDisabled,
    });
    response.body = await OrganizationService.getOne(id as string);
  }

  /**
   * Delete organization function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async remove({
    params,
    response,
  }: RouterContext<string>): Promise<void> {
    const { id } = params;
    log.debug("Removing organization");
    const deleteCount: number | Error = await OrganizationService.removeOne(
      id as string
    );
    response.body = { deleted: deleteCount };
  }
}

export default OrganizationController;
