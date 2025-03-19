const { buildHeadersForDestination } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { getNotificationDestination, readFile, buildNotification } = require("../lib/utils");
const cds = require("@sap/cds");
const LOG = cds.log('notifications');
const NOTIFICATIONS_API_ENDPOINT = "v2/Notification.svc";


module.exports = exports = class NotifyToRest extends cds.Service  {
  async init() {
    const notificationTypes = readFile(cds.env.requires?.notifications?.types);
    const eventsToListen = notificationTypes.map(notificationType => notificationType.NotificationTypeKey);
    LOG._info && LOG.info(`Listening to events: ${eventsToListen.join(", ")}`);
    this.on(eventsToListen, req => this.postNotification(req))
    return super.init()
  }

  async postNotification(req) {
    const type = req.event
    let message = req.data
    message.type = type
    message = buildNotification(message);

    const notificationDestination = await getNotificationDestination();
    const csrfHeaders = await buildHeadersForDestination(notificationDestination, {
      url: NOTIFICATIONS_API_ENDPOINT,
    });

    try {
      LOG._info && LOG.info(
        `Sending notification of key: ${message.NotificationTypeKey} and version: ${message.NotificationTypeVersion}`
      );
      await executeHttpRequest(notificationDestination, {
        url: `${NOTIFICATIONS_API_ENDPOINT}/Notifications`,
        method: "post",
        data: buildNotification(message),
        headers: csrfHeaders,
      });
    } catch (err) {
      const message = err.response.data?.error?.message?.value ?? err.response.message;
      const error = new cds.error(message);

      if (/^4\d\d$/.test(err.response?.status) && err.response?.status != 429) {
        error.unrecoverable = true;
      }

      throw error;
    }
  }
}
